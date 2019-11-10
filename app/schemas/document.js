const { Validator } = require('jsonschema');

const documentValidator = new Validator();

const sectionsSchemaId = '/document/sections';
const uniqueSectionsSchemaId = '/document/sections_with_id'
const pagesSchemaId = '/document/sections/pages';
const uniquePagesSchemaId = '/document/section/pages_with_id'
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

const pagesSchema = {
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
}

const getPagesSchema = (hasId) => {
  const { items, ...restConfig } = pagesSchema
  const { required, ...restItems } = items;
  if (hasId) {
    return {
      id: uniquePagesSchemaId,
      ...restConfig,
      items: {
        ...restItems,
        required: [
          ...required,
          'page_id',
        ],
      },
    }
  }
  return {
    id: pagesSchemaId,
    ...pagesSchema,
  }
}

const sectionsSchema = {
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
        $ref: pagesSchemaId,
      },
    },
  },
}

const getSectionsSchema = (hasId) => {
  const { items, ...restConfig } = sectionsSchema
  const { properties, required, ...restItems } = items
  if (hasId) {
    return {
      id: uniqueSectionsSchemaId,
      ...restConfig,
      items: {
        ...restItems,
        required: [
          ...required,
          'section_id',
        ],
        properties: {
          ...properties,
          pages: {
            $ref: uniquePagesSchemaId,
          },
        },
      },
    }
  }

  return {
    id: sectionsSchemaId,
    ...sectionsSchema,
  }
}

documentValidator.addSchema(pageIdSchema, pageId)
documentValidator.addSchema(getPagesSchema(), pagesSchemaId)
documentValidator.addSchema(getPagesSchema(true), uniquePagesSchemaId)

documentValidator.addSchema(sectionIdSchema, sectionId)
documentValidator.addSchema(getSectionsSchema(), sectionsSchemaId)
documentValidator.addSchema(getSectionsSchema(true), uniqueSectionsSchemaId)

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
  uniqueSectionsSchemaId,
}
