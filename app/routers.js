const compose = require('koa-compose')

const documentRouter = require('./modules/document/router')

const combineRouters = (routers) => {
  const middleware = []
  routers.forEach(router => {
    middleware.push(router.routes())
    middleware.push(router.allowedMethods())
  })
  return compose(middleware)
}

const routers = combineRouters([
  documentRouter
])

module.exports = routers;