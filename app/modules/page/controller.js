const { validateString } = require('app/utils/validator')
const responseHelper = require('app/utils/response')
const { GlobalErr, PageErr } = require('app/utils/errorMessages')

async function createPage(ctx) {
  const { body } = ctx.request
  const { path, title, content, is_root_path } = body

  // valudate auth TODO

  // validate params
  const requiredFields = [path, title, content]
  const isPassed = requiredFields.every(item => validateString(item))
  if (!isPassed) {
    responseHelper.fail(ctx, GlobalErr.PARAMS_NOT_PROVIDED)
  }

  // RETHINK DOCUMENT ID


  const responseData = {

  }

}