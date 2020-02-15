const compose = require('koa-compose')

const documentRouter = require('@app/modules/document/router')
const pageRouter = require('@app/modules/page/router')
const userRouter = require('@app/modules/user/router')
const queryRouter = require('@app/modules/query/router')

const combineRouters = (routers) => {
  const middleware = []
  routers.forEach(router => {
    middleware.push(router.routes())
    middleware.push(router.allowedMethods())
  })
  return compose(middleware)
}

const routers = combineRouters([
  documentRouter,
  pageRouter,
  userRouter,
  queryRouter,
])

module.exports = routers;
