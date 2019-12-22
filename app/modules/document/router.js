const Router = require('koa-router')
const config = require('config')
const controller = require('./controller')

const router = new Router({ prefix: `${config.apiPrefix}` })

router
  .post('createDocument', '/document/create', controller.createDocument)
  .post('publishDocument', '/document/publish', controller.publishDocument)
  .get('getDocumentInfo', '/document', controller.getDocumentInfo)

module.exports = router;
