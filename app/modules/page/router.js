const Router = require('koa-router')
const config = require('config')
const controller = require('./controller')

const router = new Router({ prefix: `${config.apiPrefix}/page` })

router
  .get('getPageInfo', '/info', controller.getPageInfo)

module.exports = router;
