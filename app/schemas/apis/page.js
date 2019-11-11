const { Validator } = require('jsonschema');

const pageValidator = new Validator();
const {
  getPagesSchema,
  pageIdRef,
  pageIdSchema,
} = require('../page');

const getPageInfoRef = 'page/getInfo';

/**
 * get page info
 */
const required = [
  'page_id',
  'page_title',
  'is_root_path',
  'path',
  'content',
]
const getPageInfoSchema = getPagesSchema({ id: getPageInfoRef, required });

pageValidator.addSchema(pageIdSchema, pageIdRef);
pageValidator.addSchema(getPageInfoRef, getPageInfoSchema)

module.exports = {
  pageValidator,
}
