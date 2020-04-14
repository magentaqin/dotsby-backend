const { Validator } = require('jsonschema')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const config = require('config')

const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const signUpQuerySchema = require('@schema/src/apis/user_signup_params')
const loginQuerySchema = require('@schema/src/apis/user_login_params')
const { GlobalErrorCodes, GlobalErr, UserErrorCodes, UserErr } = require('@app/utils/errorMessages');
const db = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { formatUTCDatetime } = require('@app/utils/datetimehelper')
const Token = require('@app/utils/token')

const validator = new Validator()
const dbConnection = db.connection;
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR]
const authFailMsg = GlobalErr[GlobalErrorCodes.AUTH_FAILED];
const { EMAIL_ALREADY_EXISTED, EMAIL_NOT_EXIST, EMAIL_PASSWORD_NOT_MATCH } = UserErrorCodes
const { jwt_secret_key } = config;
const saltRounds = 10;

const generateToken = (userId, email) => {
  const token = new Token(jwt_secret_key).sign({ userId, email }, '30d');
  return token;
}

const checkEmail = (email) => {
  const sql = `SELECT * FROM users WHERE email = ${mysql.escape(email)}`;
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('check email err', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      if (results && results.length) {
        reject(new Error(EMAIL_ALREADY_EXISTED));
      }
      resolve({ message: 'New Email' })
    })
  })
}

const createUser = (data) => {
  const { email, password_hash } = data;
  const now = formatUTCDatetime();
  const sql = `INSERT INTO users(email,password_hash,created_at,updated_at,last_login_at)
               VALUES(?,?,?,?,?)`;
  const user = [email, password_hash, now, now, now];
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, user, (error, results) => {
      if (error) {
        Logger.error('insert new user err: ', error, email)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryUserById = (id) => {
  const sql = `SELECT * FROM users WHERE id = ${mysql.escape(id)}` ;
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('query user by id error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryUserByEmail = (email) => {
  const sql = `SELECT * FROM users WHERE email = ${mysql.escape(email)}` ;
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, (error, results) => {
      if (error) {
        Logger.error('query user by email error', error)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const updateLastLoginTime = (id) => {
  const now = formatUTCDatetime();
  const sql = `UPDATE users SET last_login_at = ? WHERE id = ?`;
  const user = [now, id];
  return new Promise((resolve, reject) => {
    dbConnection.instance.query(sql, user, (error, results) => {
      if (error) {
        Logger.error('update last login time err: ', error, id)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const signUp = async(ctx) => {
  const { email, password } = ctx.request.body;

  // validate request body
  const validationResult = validator.validate(ctx.request.body, signUpQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // check if email already existed
  await checkEmail(email).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
    if (err.message === EMAIL_ALREADY_EXISTED) {
      responseHelper.fail(ctx, EMAIL_ALREADY_EXISTED, UserErr[EMAIL_ALREADY_EXISTED], 409);
    }
  });

  // hash password
  const password_hash = await bcrypt.hash(password, saltRounds).catch(err => {
    responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
  })

  // insert user to users table
  const insertResp = await createUser({ email, password_hash }).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  // get newly created user
  const queryResp = await queryUserById(insertResp.data.insertId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  const userInfo = queryResp.data[0]
  const {created_at, updated_at, last_login_at, status, id } = userInfo

  // generate token
  const token = generateToken(id, email)
  const responseData = {
    email: userInfo.email,
    token,
    created_at: formatUTCDatetime(created_at, true),
    updated_at: formatUTCDatetime(updated_at, true),
    last_login_at: formatUTCDatetime(last_login_at, true),
    status,
  }
  responseHelper.success(ctx, responseData, 200)
}

const login = async(ctx) => {
  const { email, password } = ctx.request.body;

  // validate request body
  const validationResult = validator.validate(ctx.request.body, loginQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // check if user existed
  const userQuery = await queryUserByEmail(email).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  if (userQuery && !userQuery.data.length) {
    responseHelper.fail(ctx, EMAIL_NOT_EXIST, UserErr[EMAIL_NOT_EXIST], 404);
  }

  // check if password is correct
  const { password_hash, id } = userQuery.data[0];
  const isMatch = await bcrypt.compare(password, password_hash);
  if (!isMatch) {
    responseHelper.fail(ctx, EMAIL_PASSWORD_NOT_MATCH, UserErr[EMAIL_PASSWORD_NOT_MATCH], 401);
  }

  // update last_login_at
  await updateLastLoginTime(id).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const updatedUser = await queryUserById(id).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })

  const { created_at, updated_at, last_login_at, status } = updatedUser.data[0];
  // generate token
  const token = generateToken(id, email);
  const responseData = {
    email,
    token,
    created_at: formatUTCDatetime(created_at, true),
    updated_at: formatUTCDatetime(updated_at, true),
    last_login_at: formatUTCDatetime(last_login_at, true),
    status,
  }

  responseHelper.success(ctx, responseData, 200);
}

const getUserInfo = async(ctx) => {
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const queryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = queryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  const { created_at, updated_at, last_login_at, status } = userInfo;
  const responseData = {
    email: userInfo.email,
    token: ctx.token,
    created_at: formatUTCDatetime(created_at, true),
    updated_at: formatUTCDatetime(updated_at, true),
    last_login_at: formatUTCDatetime(last_login_at, true),
    status,
  }
  responseHelper.success(ctx, responseData, 200);
}

const logout = async(ctx) => {
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const queryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = queryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  responseHelper.success(ctx, {}, 200);
}

module.exports = {
  signUp,
  login,
  getUserInfo,
  logout,
}
