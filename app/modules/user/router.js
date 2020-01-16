const Router = require('koa-router')
const config = require('config')
const controller = require('./controller')

const router = new Router({ prefix: `${config.apiPrefix}` })

router
  .post('signUp', '/user/signup', controller.signUp)
  .post('login', '/user/login', controller.login)
  .get('getUserInfo', '/user/info', controller.getUserInfo)
  .post('logout', '/logout', controller.logout)

module.exports = router;
