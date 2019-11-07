const { documentValidator, sectionsSchemaId, documentId } = require('../document')

const sampleDocument = {
  document_id: 1223,
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
          content: '<h1>This part is written by John.</h1>',
        },
        {
          page_title: 'Login',
          path: '/user/login',
          content: '<h1>Login Api</h1>',
        },
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
        },
      ],
    },
  ],
}

/**
 * create document
 */

const createDocumentQuerySchema = {
  type: 'object',
  required: [
    'document_token',
    'version',
    'doc_title',
    'sections',
  ],
  properties: {
    document_token: {
      type: 'string',
      minLength: 1,
      maxLength: 32,
      format: 'ascii_printable',
      description: 'auto generated document_token',
    },
    version: {
      type: 'number',
      minimum: 0,
      description: 'version of document',
    },
    doc_title: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      format: 'ascii_printable',
      description: 'title of document',
    },
    sections: {
      $ref: sectionsSchemaId,
    },
  },
}

const createDocumentResponseSchema = {
  type: 'object',
  required: [
    'document_id',
  ],
  properties: {
    document_id: {
      $ref: documentId,
    },
  },
}

const validationResult = documentValidator.validate(sampleDocument, createDocumentResponseSchema)
console.log(validationResult.errors)