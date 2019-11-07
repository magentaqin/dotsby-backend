const { Validator } = require('jsonschema');

const v = new Validator();
const sectionsSchemaId = '/document/sections';
const pagesSchemaId = '/document/sections/pages';
const autoIncrementId = 'autoIncrementId';

const sampleDocument = {
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

const documentIdSchema = {
  id: autoIncrementId,
  type: 'number',
  minimum: 0,
  description: 'auto increment document id',
}

const pagesSchema = {
  id: pagesSchemaId,
  type: 'array',
  description: 'pages of section',
  minItems: 1,
  items: {
    type: 'object',
    required: [
      'page_title',
      'path',
      'content',
    ],
    properties: {
      page_title: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        format: 'ascii_printable',
        description: 'title of page',
      },
      is_root_path: {
        type: 'boolean',
        description: 'whether this page is the index page',
      },
      path: {
        type: 'string',
        minLength: 1,
        maxLength: 32,
        format: 'ascii_printable',
        description: 'page path',
      },
      content: {
        type: 'string',
        minLength: 1,
        format: 'ascii_printable',
        description: 'page content',
      },
    },
  },
}

const sectionsSchema = {
  id: sectionsSchemaId,
  type: 'array',
  description: 'sections of document',
  minItems: 1,
  items: {
    type: 'object',
    required: [
      'section_title',
      'pages',
    ],
    properties: {
      section_title: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        format: 'ascii_printable',
        description: 'title of section',
      },
      pages: {
        $ref: pagesSchemaId,
      },
    },
  },
}

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
      $ref: documentIdSchema,
    },
  },
}

v.addSchema(pagesSchema, pagesSchemaId)
v.addSchema(sectionsSchema, sectionsSchemaId)
const validationResult = v.validate(sampleDocument, createDocumentQuerySchema)
console.log(validationResult.errors)
