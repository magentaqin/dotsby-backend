const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const { samplePageInfo } = require('@test/sampleData')
const { Validator } = require('jsonschema')
const getPageInfoQuerySchema = require('@schema/src/apis/page_info_params')

const validator = new Validator()

const getPageInfo = async(ctx) => {
  const { id } = ctx.request.query;
  const validationResult = validator.validate({ id: Number(id) }, getPageInfoQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  const index = Number(id) - 1;
  const data = samplePageInfo[index];
  responseHelper.success(ctx, data, 200)
}

module.exports = {
  getPageInfo,
}
