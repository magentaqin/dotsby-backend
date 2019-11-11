/* eslint-disable arrow-body-style */
const { getPageSchema } = require('./page')

const documentIdRef = '/document/id';
const documentTokenRef = '/document/token'
const sectionIdRef = '/document/section/id'

const documentIdSchema = {
  id: documentIdRef,
  type: 'number',
  minimum: 1,
  description: 'auto increment document id',
}

const sectionIdSchema = {
  id: sectionIdRef,
  type: 'number',
  minimum: 1,
  description: 'auto increment section id',
}

const documentTokenSchema = {
  id: documentTokenRef,
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
      $ref: config.pageRef,
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
          $ref: sectionIdRef,
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

module.exports = {
  documentIdRef,
  documentIdSchema,
  documentTokenRef,
  documentTokenSchema,
  getPagesSchema,
  getSectionsSchema,
  sectionIdSchema,
  sectionIdRef,
}
