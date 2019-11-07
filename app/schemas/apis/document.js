const { sectionsSchemaId, documentId, documentTokenId } = require('../document')

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


module.exports = {
  createDocumentQuerySchema,
  createDocumentResponseSchema,
  getDocumentTokenResponseSchema,
}