const success = (ctx, data = '', status = 200) => {
  ctx.status = status;
  ctx.body = { data }
}

const fail = (ctx, errMsg = 'Bad Request', status = 400) => {
  const error = { error: errMsg }
  ctx.throw(status, JSON.stringify(error))
}

module.exports = {
  success,
  fail,
}