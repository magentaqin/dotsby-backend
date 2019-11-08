const { sectionsSchemaId, documentId, documentTokenId, uniqueSectionsSchemaId } = require('../document')

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
      $ref: sectionsSchemaId,
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
    'document_token'
  ],
  properties: {
    document_token: {
      $ref: documentTokenId
    }
  }
}


/**
 * get document info
 */
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
      $ref: uniqueSectionsSchemaId,
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