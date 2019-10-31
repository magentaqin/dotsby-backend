
const Logger = require('@app/utils/logger')

const success = (ctx, data = '', status = 200) => {
  ctx.status = status;
  ctx.body = { data }
}

const fail = (ctx, errMsg = 'Bad Request', status = 400) => {
  const error = { error: errMsg }
  Logger.error(JSON.stringify(error))
  ctx.throw(status, JSON.stringify(error))
}

const paramsRequiredFail = (ctx, invalidField) => {
  fail(ctx, `${invalidField} is required.`, 400)
}

module.exports = {
  success,
  fail,
  paramsRequiredFail,
}
