const {
  // validateString,
  getInvalidRequiredField,
  getInvalidArrRequiredField,
} = require('@app/utils/validator')
const responseHelper = require('@app/utils/response')
// const { GlobalErr } = require('@app/utils/errorMessages')

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
  const {
    document_token, version, doc_title, sections,
  } = ctx.request.body;

  // validate if document_token already existed. IF NOT EXIST, THROW 401. TODO.
  // validate if verion already existed. IF existed, THROW 400. document already existsed. TODO.

  // handle required fields
  const requiredFields = {
    document_token,
    version,
    doc_title,
    sections,
  }
  const invalidField = getInvalidRequiredField(requiredFields)
  if (invalidField) {
    responseHelper.paramsRequiredFail(ctx, invalidField)
  }

  const invalidSectionField = getInvalidArrRequiredField(sections, ['section_title', 'pages'])
  if (invalidSectionField) {
    responseHelper.paramsRequiredFail(ctx, invalidSectionField)
  }

  let invalidPageField = ''
  sections.every(section => {
    invalidPageField = getInvalidArrRequiredField(section.pages, ['page_title', 'path', 'content'])
    if (invalidPageField) {
      return false;
    }
    return true;
  })
  if (invalidPageField) {
    responseHelper.paramsRequiredFail(ctx, invalidPageField)
  }

  // validate value type

  // validate whether version is number.

  const data = {
    document_id: 120391023910923,
  }

  responseHelper.success(ctx, data, 200)
}

module.exports = {
  getDocumentToken,
  createDocument,
}
