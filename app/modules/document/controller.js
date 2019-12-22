const { Validator } = require('jsonschema')
const hashHelper = require('object-hash');

const createDocumentQuerySchema = require('@schema/src/apis/document_create_params');
const getDocumentInfoQuerySchema = require('@schema/src/apis/document_info_params');
const { GlobalErrorCodes, GlobalErr, UserErrorCodes, UserErr } = require('@app/utils/errorMessages');
const { extractErrMsg } = require('@app/utils/extract')
const { sampleDocumentInfo } = require('@test/sampleData')
const { queryUserById } = require('@app/modules/user/query');
const responseHelper = require('@app/utils/response')

const validator = new Validator();
const serverErrMsg = GlobalErr[GlobalErrorCodes.SERVER_ERROR];
const authFailMsg = GlobalErr[GlobalErrorCodes.AUTH_FAILED];


const generateNewDocumentId = async(ctx) => {
  if (!ctx.isTokenValid) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }
  const { userId, email } = ctx.tokenPayload;
  const queryResp = await queryUserById(userId).catch(err => {
    if (err.message === GlobalErrorCodes.SERVER_ERROR) {
      responseHelper.fail(ctx, GlobalErrorCodes.SERVER_ERROR, serverErrMsg, 500);
    }
  })
  const userInfo = queryResp.data[0];
  if (userInfo.email !== email) {
    responseHelper.fail(ctx, GlobalErrorCodes.AUTH_FAILED, authFailMsg, 401);
  }

  // hash document_id. document_id is used to identify the document.
  const document_id = hashHelper({ email, document_created_at: Date.now() })

  responseHelper.success(ctx, { document_id }, 200);
}

const createDocument = async(ctx) => {
  // validate if document_token already existed. IF NOT EXIST, THROW 401. TODO.
  // validate if verion already existed. IF existed, THROW 403. document already existsed. TODO.
  // schema validation
  const validationResult = validator.validate(ctx.request.body, createDocumentQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  const data = {
    document_id: '1qazxsw2',
    version: 0.1,
  }

  responseHelper.success(ctx, data, 200)
}


const getDocumentInfo = async(ctx) => {
  const { document_id, version } = ctx.request.query;
  // 400
  const query = {
    document_id,
    version: Number(version),
  }
  const validationResult = validator.validate(query, getDocumentInfoQuerySchema.schema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // 401 TODO

  // mock data. TEMPORARY
  const data = sampleDocumentInfo

  responseHelper.success(ctx, data, 200)
}

module.exports = {
  generateNewDocumentId,
  createDocument,
  getDocumentInfo,
}
