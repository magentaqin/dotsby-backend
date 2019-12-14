const { Validator } = require('jsonschema')
const mysql = require('mysql')

const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const signUpQuerySchema = require('@schema/src/apis/user_signup_params')
const { GlobalErrorCodes, GlobalErr, UserErrorCodes, UserErr } = require('@app/utils/errorMessages');
const dbConnection = require('@app/db/init');

const validator = new Validator()
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR]
const { EMAIL_ALREADY_EXISTED } = UserErrorCodes

const signUp = async(ctx) => {
  // validate request body
  const validationResult = validator.validate(ctx.request.body, signUpQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // check if email already existed
  const { email } = ctx.request.body;
  const sql = `SELECT * FROM users WHERE email = ${mysql.escape(email)}`;
  dbConnection.query(sql, (error, results) => {
    if (error) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
    if (results && results.length) {
      responseHelper.fail(ctx, EMAIL_ALREADY_EXISTED, UserErr[EMAIL_ALREADY_EXISTED], 409);
    }
  })
  responseHelper.success(ctx, { user: 'hahah' }, 200)
}

module.exports = {
  signUp,
}
