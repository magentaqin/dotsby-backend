const {
  documentId,
  documentTokenId,
  documentValidator,
  getPagesSchema,
  getSectionsSchema,
} = require('../document')

/**
 * create document
 */
const createPagesRef = '/document/createDocument/sections/pages'
const createSectionsRef = '/document/createDocument/sections'
const createPagesSchema = getPagesSchema({ id: createPagesRef, required: ['page_title', 'path', 'content'] })
const createSectionsSchema = getSectionsSchema({ id: createSectionsRef, required: ['section_title', 'pages'], pagesRef: createPagesRef })
documentValidator.addSchema(createPagesSchema, createPagesRef)
documentValidator.addSchema(createSectionsSchema, createSectionsRef)

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
      $ref: documentTokenId,
    },
    is_private: {
      type: 'boolean',
      description: 'whether this document is private',
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
      $ref: createSectionsRef,
    },
  },
}

const documentIdSchema = {
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

const createDocumentResponseSchema = documentIdSchema

/**
 * get document token
 */
const getDocumentTokenResponseSchema = {
  type: 'object',
  required: [
    'document_token',
  ],
  properties: {
    document_token: {
      $ref: documentTokenId,
    },
  },
}


/**
 * get document info
 */
const getPagesRef = '/document/getDocumentInfo/sections/pages'
const getSectionsRef = '/document/getDocumentInfo/sections'
const getDocumentPagesSchema = getPagesSchema({ id: getPagesRef, required: ['page_title', 'path', 'page_id'] })
const getDocumentSectionsSchema = getSectionsSchema({ id: getSectionsRef, required: ['section_title', 'pages', 'section_id'], pagesRef: getPagesRef })
documentValidator.addSchema(getDocumentPagesSchema, getPagesRef)
documentValidator.addSchema(getDocumentSectionsSchema, getSectionsRef)


const getDocumentInfoQuerySchema = documentIdSchema;
const getDocumentInfoResponseSchema = {
  type: 'object',
  required: [
    'document_id',
    'document_token',
    'version',
    'doc_title',
    'sections',
  ],
  properties: {
    document_token: {
      $ref: documentTokenId,
    },
    is_private: {
      type: 'boolean',
      description: 'whether this document is private',
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
      $ref: getSectionsRef,
    },
  },
}

module.exports = {
  createDocumentQuerySchema,
  createDocumentResponseSchema,
  getDocumentTokenResponseSchema,
  getDocumentInfoQuerySchema,
  getDocumentInfoResponseSchema,
}
