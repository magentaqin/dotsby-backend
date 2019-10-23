const { validateString } = require('@app/utils/validator')
const responseHelper = require('@app/utils/response')
const { GlobalErr } = require('@app/utils/errorMessages')

// AUTH REQUIRED
const getNewDocumentToken = async(ctx) => {
  // HANDLE 401.TODO
  // HANDLE 403. TODO
  const data = {
    document_token: '1qazxsw2'
  }
  responseHelper.success(ctx, data)
}

module.exports = {
  getNewDocumentToken
}