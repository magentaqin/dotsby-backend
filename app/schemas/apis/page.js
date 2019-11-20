const { Validator } = require('jsonschema');

const pageValidator = new Validator();
const {
  getPageSchema,
  pageIdRef,
  pageIdSchema,
} = require('../page');

const getPageInfoRef = 'page/getInfo/response';
const getPageInfoQueryRef = 'page/getInfo/query'

/**
 * get page info
 */
const required = [
  'page_id',
  'page_title',
  'is_root_path',
  'path',
]
const getPageInfoQuerySchema = {
  id: getPageInfoQueryRef,
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      $ref: pageIdRef,
    },
  },
}
const getPageInfoSchema = getPageSchema({ id: getPageInfoRef, required });

pageValidator.addSchema(pageIdSchema, pageIdRef);
pageValidator.addSchema(getPageInfoQueryRef, getPageInfoQuerySchema)
pageValidator.addSchema(getPageInfoRef, getPageInfoSchema)

module.exports = {
  pageValidator,
  getPageInfoQuerySchema,
  getPageInfoSchema,
}
