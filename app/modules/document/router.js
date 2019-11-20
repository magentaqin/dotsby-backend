const Router = require('koa-router')
const config = require('config')
const controller = require('./controller')

const router = new Router({ prefix: `${config.apiPrefix}` })

router
  .get('getDocumentToken', '/document/token', controller.getDocumentToken)
  .post('createDocument', '/document/create', controller.createDocument)
  .get('getDocumentInfo', '/document', controller.getDocumentInfo)

module.exports = router;
