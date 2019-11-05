
const Logger = require('@app/utils/logger')
const { GlobalErrorCodes } = require('@app/utils/errorMessages')

const success = (ctx, data = '', status = 200) => {
  ctx.status = status;
  ctx.body = { data }
}

const fail = (ctx, errorCode, errMsg, status = 400) => {
  const error = { code: errorCode, msg: errMsg }
  Logger.error(JSON.stringify(error))
  ctx.throw(status, JSON.stringify(error))
}

const paramsRequiredFail = (ctx, invalidField) => {
  fail(ctx, GlobalErrorCodes.INVALID_PARAMETERS, `${invalidField} is required.`, 400)
}

module.exports = {
  success,
  fail,
  paramsRequiredFail,
}
