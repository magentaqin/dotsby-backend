
const Logger = require('@app/utils/logger')
const { GlobalErrorCodes } = require('@app/utils/errorMessages')

const success = (ctx, data = '', status = 200) => {
  ctx.status = status;
  ctx.body = { data }
}

const fail = (ctx, errorCode, errMsg, status = 400) => {
  const error = { code: errorCode, message: errMsg }
  Logger.error(JSON.stringify(error))
  ctx.throw(status, JSON.stringify(error))
}

const paramsFail = (ctx, errMsg) => {
  fail(ctx, GlobalErrorCodes.INVALID_PARAMETERS, errMsg, 400)
}

module.exports = {
  success,
  fail,
  paramsFail,
}
