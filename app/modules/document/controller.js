const responseHelper = require('@app/utils/response')
const { GlobalErr } = require('@app/utils/errorMessages')
const { documentValidator } = require('@app/schemas/document')
const {
  createDocumentQuerySchema,
  createDocumentResponseSchema,
} = require('@app/schemas/apis/document')

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
  if (validationResult.errors.length) {
    const error = validationResult.errors[0]
    const { message, property } = error
    const errMsg = property + message;
    responseHelper.paramsFail(ctx, errMsg)
  }

  const data = {
    document_id: 1,
  }

  responseHelper.success(ctx, data, 200)
}


const getDocumentInfo = async(ctx) => {
  // 400
  const { document_id } = ctx.request.body;
  if (!document_id) {
    responseHelper.paramsFail(ctx, 'document_id is required')
  }

  // 401 TODO

  // mock data. TEMPORARY
  const data = {
    document_id: 1,
    document_token: '1qazxsw2',
    version: 0.1,
    doc_title: 'Sample Doc',
    sections: [
      {
        section_title: 'User Section',
        pages: [
          {
            page_title: 'User Section Description',
            is_root_path: true,
            path: '/user',
            content: '<h1>This part is written by John.</h1>'
          },
          {
            page_title: 'Login',
            path: '/user/login',
            content: '<h1>Login Api</h1>',
          }
        ],
      },
      {
        section_title: 'Account Section',
        path: '/account',
        pages: [
          {
            page_title: 'Create Account',
            path: '/account/create',
            content: '<h1>Create Account Api</h1>',
          },
          {
            page_title: 'Get Account Info',
            path: '/account/info',
            content: '<h1>Get Account Info Api</h1>',
          }
        ]
      }
    ]
  }

  responseHelper.success(ctx, data, 200)
}

module.exports = {
  getDocumentToken,
  createDocument,
  getDocumentInfo,
}
