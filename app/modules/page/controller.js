const responseHelper = require('@app/utils/response')
const { extractErrMsg } = require('@app/utils/extract')
const { queryDocAuth, queryUserById } = require('@app/modules/document/query');
const { Validator } = require('jsonschema')
const {
  GlobalErrorCodes, GlobalErr,
} = require('@app/utils/errorMessages');
const getPageInfoQuerySchema = require('@schema/src/apis/page_info_params')
const { formatUTCDatetime } = require('@app/utils/datetimehelper');
const { queryPageById } = require('./query');

const validator = new Validator()
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR];
const notFoundMsg = GlobalErr[GlobalErrorCodes.NOT_FOUND];
const authFailMsg = GlobalErr[GlobalErrorCodes.AUTH_FAILED];

const getPageInfo = async(ctx) => {
  const validationResult = validator.validate(ctx.request.query, getPageInfoQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }
  const { document_id, page_id } = ctx.request.query;
  // document not found
  const docQueryResp = await queryDocAuth(document_id).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  if (!docQueryResp.data.length) {
    responseHelper.fail(ctx, GlobalErrorCodes.NOT_FOUND, notFoundMsg, 404);
  }

  // handle unauthorized
  const isPrivate = docQueryResp.data[0].is_private;
  if (isPrivate) {
    if (!ctx.isTokenValid) {
      responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
    }
    const { userId, email } = ctx.tokenPayload;
    const userQueryResp = await queryUserById(userId).catch(err => {
      if (err.message === GlobalErrorCodes.SERVER_ERROR) {
        responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
      }
    })
    const userInfo = userQueryResp.data[0];
    if (userInfo.email !== email) {
      responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
    }
  }

  // page not found
  const pageQueryResp = await queryPageById(page_id).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  if (!pageQueryResp.data.length) {
    responseHelper.fail(ctx, GlobalErrorCodes.NOT_FOUND, notFoundMsg, 404);
  }

  const data = pageQueryResp.data[0];
  data.is_root_path = !!data.is_root_path;
  data.api_content = data.api_content ? JSON.parse(data.api_content) : data.api_content;
  data.created_at = formatUTCDatetime(data.created_at, true);
  data.updated_at = formatUTCDatetime(data.updated_at, true);
  responseHelper.success(ctx, data, 200)
}

module.exports = {
  getPageInfo,
}
