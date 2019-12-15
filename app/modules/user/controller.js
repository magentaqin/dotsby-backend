const { Validator } = require('jsonschema')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const config = require('config')

const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const signUpQuerySchema = require('@schema/src/apis/user_signup_params')
const { GlobalErrorCodes, GlobalErr, UserErrorCodes, UserErr } = require('@app/utils/errorMessages');
const dbConnection = require('@app/db/init');
const Logger = require('@app/utils/logger');
const { formatUTCDatetime } = require('@app/utils/datetimehelper')
const Token = require('@app/utils/token')

const validator = new Validator()
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR]
const { EMAIL_ALREADY_EXISTED } = UserErrorCodes
const { jwt_secret_key } = config;

const generateToken = (userId, email) => {
  const token = new Token(jwt_secret_key).sign({ userId, email }, '30d');
  return token;
}

const checkEmail = (email) => {
  const sql = `SELECT * FROM users WHERE email = ${mysql.escape(email)}`;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
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
    dbConnection.query(sql, user, (error, results) => {
      if (error) {
        Logger.error('insert new user err: ', error, email)
        reject(new Error(GlobalErrorCodes.SERVER_ERROR))
      }
      resolve({ data: results })
    })
  })
}

const queryUser = (id) => {
  const sql = `SELECT * FROM users WHERE id = ${mysql.escape(id)}` ;
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, results) => {
      if (error) {
        Logger.error('check email err', error)
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
  const saltRounds = 10;
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
  const queryResp = await queryUser(insertResp.data.insertId).catch(err => {
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
    created_at: formatUTCDatetime(created_at),
    updated_at: formatUTCDatetime(updated_at),
    last_login_at: formatUTCDatetime(last_login_at),
    status,
  }
  responseHelper.success(ctx, responseData, 200)
}

module.exports = {
  signUp,
}
