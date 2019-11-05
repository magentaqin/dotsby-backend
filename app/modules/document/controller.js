const {
  validateString,
  validateNumber,
  getInvalidRequiredField,
  getInvalidArrRequiredField,
} = require('@app/utils/validator')
const responseHelper = require('@app/utils/response')
const { GlobalErr } = require('@app/utils/errorMessages')

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

  console.log('body', ctx.request.body)

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
  // if (!validateNumber(version)) {
  //   responseHelper.fail(ctx, `Version ${GlobalErr.NUMBER_REQUIRED}.`, 400);
  // }

  const data = {
    document_id: 1,
  }

  responseHelper.success(ctx, data, 200)
}


const getDocumentInfo = async(ctx) => {
  // 400
  const { document_id } = ctx.request.body;
  if (!document_id) {
    responseHelper.paramsRequiredFail(ctx, 'document_id')
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
