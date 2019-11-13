const responseHelper = require('@app/utils/response')
const {
  pageValidator,
  getPageInfoQuerySchema,
} = require('@app/schemas/apis/page')
const { extractErrMsg } = require('@app/utils/extract')
const { samplePageInfo } = require('@test/sampleData')

const getPageInfo = async(ctx) => {
  const { id } = ctx.request.query;
  const validationResult = pageValidator.validate({ id: Number(id) }, getPageInfoQuerySchema)
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
