/* eslint-disable arrow-body-style */
const { Validator } = require('jsonschema');

const documentValidator = new Validator();

const documentId = '/document/id';
const documentTokenId = '/document/token'
const sectionId = '/document/section/id'
const pageId = '/document/section/page/id'

const documentIdSchema = {
  id: documentId,
  type: 'number',
  minimum: 1,
  description: 'auto increment document id',
}

const sectionIdSchema = {
  id: sectionId,
  type: 'number',
  minimum: 1,
  description: 'auto increment section id',
}

const pageIdSchema = {
  id: pageId,
  type: 'number',
  minimum: 1,
  description: 'auto increment page id',
}

const documentTokenSchema = {
  id: documentTokenId,
  type: 'string',
  minLength: 1,
  maxLength: 100,
  format: 'ascii_printable',
  description: 'auto generated document_token',
}

const getPagesSchema = (config) => {
  return {
    id: config.id,
    type: 'array',
    description: 'pages of section',
    minItems: 1,
    items: {
      type: 'object',
      required: config.required,
      properties: {
        page_id: {
          $ref: pageId,
        },
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
  };
}

const getSectionsSchema = (config) => {
  return {
    id: config.id,
    type: 'array',
    description: 'sections of document',
    minItems: 1,
    items: {
      type: 'object',
      required: config.required,
      properties: {
        section_id: {
          $ref: sectionId,
        },
        section_title: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
          format: 'ascii_printable',
          description: 'title of section',
        },
        pages: {
          $ref: config.pagesRef,
        },
      },
    },
  }
}

documentValidator.addSchema(pageIdSchema, pageId)

documentValidator.addSchema(sectionIdSchema, sectionId)

documentValidator.addSchema(documentIdSchema, documentId)
documentValidator.addSchema(documentTokenSchema, documentTokenId)

module.exports = {
  documentId,
  documentIdSchema,
  documentValidator,
  documentTokenId,
  getPagesSchema,
  getSectionsSchema,
}
