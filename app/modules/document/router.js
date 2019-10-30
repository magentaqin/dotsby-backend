const Router = require('koa-router')
const config = require('config')
const controller = require('./controller')

const router = new Router({ prefix: `${config.apiPrefix}/document` })

router
  .get('getDocumentToken', '/getDocumentToken', controller.getDocumentToken)
  .post('createDocument', '/createDocument', controller.createDocument)

module.exports = router;
