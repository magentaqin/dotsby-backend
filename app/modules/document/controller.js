const responseHelper = require('@app/utils/response')
const { documentValidator } = require('@app/schemas/document')
const {
  createDocumentQuerySchema,
  getDocumentInfoQuerySchema,
} = require('@app/schemas/apis/document')
const { extractErrMsg } = require('@app/utils/extract')
const { sampleDocumentInfo } = require('@test/sampleData')

// AUTH REQUIRED
const getDocumentToken = async(ctx) => {
  // HANDLE 401.TODO
  // HANDLE 403. TODO
  const data = {
    document_token: '1qazxsw2',
  }
  responseHelper.success(ctx, data)
}

const createDocument = async(ctx) => {
  // validate if document_token already existed. IF NOT EXIST, THROW 401. TODO.
  // validate if verion already existed. IF existed, THROW 403. document already existsed. TODO.

  // schema validation
  const validationResult = documentValidator.validate(ctx.request.body, createDocumentQuerySchema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  const data = {
    document_id: 1,
  }

  responseHelper.success(ctx, data, 200)
}


const getDocumentInfo = async(ctx) => {
  const { document_id } = ctx.request.query;
  // 400
  const query = {
    document_id: Number(document_id),
  }
  const validationResult = documentValidator.validate(query, getDocumentInfoQuerySchema)
  if (!validationResult.instance || validationResult.errors.length) {
    responseHelper.paramsFail(ctx, extractErrMsg(validationResult))
  }

  // 401 TODO

  // mock data. TEMPORARY
  const data = sampleDocumentInfo

  responseHelper.success(ctx, data, 200)
}

module.exports = {
  getDocumentToken,
  createDocument,
  getDocumentInfo,
}
