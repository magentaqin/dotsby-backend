const { Validator } = require('jsonschema');

const documentValidator = new Validator();

const sectionsSchemaId = '/document/sections';
const pagesSchemaId = '/document/sections/pages';
const documentId = '/document/id';
const documentTokenId = '/document/token'

const documentIdSchema = {
  id: documentId,
  type: 'number',
  minimum: 0,
  description: 'auto increment document id',
}

const documentTokenSchema = {
  id: documentTokenId,
  type: 'string',
  minLength: 1,
  maxLength: 100,
  format: 'ascii_printable',
  description: 'auto generated document_token',
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

documentValidator.addSchema(pagesSchema, pagesSchemaId)
documentValidator.addSchema(sectionsSchema, sectionsSchemaId)
documentValidator.addSchema(documentIdSchema, documentId)
documentValidator.addSchema(documentTokenSchema, documentTokenId)

module.exports = {
  documentId,
  pagesSchemaId,
  sectionsSchemaId,
  documentIdSchema,
  pagesSchema,
  sectionsSchema,
  documentValidator,
  documentTokenId,
  documentTokenSchema,
}