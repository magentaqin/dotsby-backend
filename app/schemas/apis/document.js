const { Validator } = require('jsonschema');

const documentValidator = new Validator();

const {
  documentIdRef,
  documentTokenRef,
  getPagesSchema,
  getSectionsSchema,
  sectionIdRef,
  sectionIdSchema,
  documentIdSchema,
  documentTokenSchema,
} = require('../document')
const { pageIdRef, pageIdSchema, getPageSchema } = require('../page')

documentValidator.addSchema(pageIdSchema, pageIdRef)
documentValidator.addSchema(sectionIdSchema, sectionIdRef)
documentValidator.addSchema(documentIdSchema, documentIdRef)
documentValidator.addSchema(documentTokenSchema, documentTokenRef)

/**
 * create document
 */
const createPagesRef = '/document/createDocument/sections/pages'
const createSectionsRef = '/document/createDocument/sections'
const createPageModelRef = '/document/createDocument/section/pages/page'

const createPageModelSchema = getPageSchema({ id: createPageModelRef, required: ['page_title', 'path'] })
const createPagesSchema = getPagesSchema({ id: createPagesRef, pageRef: createPageModelRef })
const createSectionsSchema = getSectionsSchema({ id: createSectionsRef, required: ['section_title'], pagesRef: createPagesRef })
documentValidator.addSchema(createPageModelSchema, createPageModelRef)
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
      $ref: documentTokenRef,
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

const createDocumentResponseSchema = {
  type: 'object',
  required: [
    'document_id',
  ],
  properties: {
    document_id: {
      $ref: documentIdRef,
    },
  },
}

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
      $ref: documentTokenRef,
    },
  },
}


/**
 * get document info
 */
const getPagesRef = '/document/getDocumentInfo/sections/pages'
const getSectionsRef = '/document/getDocumentInfo/sections'
const getPageModelRef = '/document/getDocumentInfo/pages/page'

const getPageModelSchema = getPageSchema({ id: getPageModelRef, required: ['page_title', 'path', 'page_id'] })
const getDocumentPagesSchema = getPagesSchema({ id: getPagesRef })
const getDocumentSectionsSchema = getSectionsSchema({ id: getSectionsRef, required: ['section_title', 'pages', 'section_id'], pagesRef: getPagesRef })

documentValidator.addSchema(getPageModelSchema, getPageModelRef)
documentValidator.addSchema(getDocumentPagesSchema, getPagesRef)
documentValidator.addSchema(getDocumentSectionsSchema, getSectionsRef)


const getDocumentInfoQuerySchema = {
  type: 'object',
  required: [
    'document_id',
  ],
  properties: {
    document_id: {
      $ref: documentIdRef,
    },
  },
};
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
      $ref: documentTokenRef,
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
  documentValidator,
}
