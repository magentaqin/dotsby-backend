const Router = require('koa-router')
const config = require('config')
const controller = require('./controller')

const router = new Router({ prefix: `${config.apiPrefix}` })

router
  .get('listQueryResults', '/query', controller.listQueryResults)

module.exports = router;