const assert = require('assert')
const { Validator } = require('jsonschema');
const http = require('@test/request')
const router = require('@app/modules/document/router')
const { sampleDocument } = require('@test/sampleData')
const createDocumentResponseSchema = require('@schema/src/apis/document_create_response')
const getDocumentInfoResponseSchema = require('@schema/src/apis/document_info_response')
const generateNewDocumentIdSchema = require('@schema/src/apis/document_new_id_response')
const errorResponseSchema = require('@schema/src/response/type_response_error')
const { GlobalErrorCodes } = require('@app/utils/errorMessages')

const validator = new Validator()

const generateNewDocumentIdUrl = router.url('generateNewDocumentId')
const createDocUrl = router.url('createDocument')
const getDocInfoUrl = router.url('getDocumentInfo')

describe('Test Document APIS', async () => {
  /**
   * Get Document Token Api
   */
  describe('Generate new document id', async() => {
    it('should return document_id and 200 when authorized', async() => {
      const resp = await http.get(generateNewDocumentIdUrl)
      const result = validator.validate(resp.data.data, generateNewDocumentIdSchema.schema)
      assert(result.errors.length === 0)
      assert(resp.status === 200)
    })

    // 401. TODO.
    // 403. TODO.
  })

  /**
   * Create Document Api
   */
  describe('Create Document', async () => {
    // 200 OK
    it('should return id and version and 200 status when document is created successfully', async() => {
      const resp = await http.post(createDocUrl, sampleDocument)

      const validationResult = validator
        .validate(
          resp.data.data,
          createDocumentResponseSchema.schema,
        );
      assert(validationResult.errors.length === 0)
      assert(resp.status === 200)
    });

    // 400
    it('should return error code INVALID_PARAMETER and 400 status when query schema validation failed', async() => {
      const resp = await http.post(createDocUrl, {})
      assert(resp.status === 400)
      assert(validator.validate(resp.data, errorResponseSchema.schema).errors.length === 0)
      assert(resp.data.code === GlobalErrorCodes.INVALID_PARAMETERS)
    })

    // 401 TODO

    // 403 TODO
  });


  /**
   * Get Document Info Api
   */
  describe('Get Document Info', async() => {
    // 200 OK
    it('should return document info and 200 status when authorized', async() => {
      const resp = await http.get(getDocInfoUrl, { document_id: '1qazxsw2', version: 0.1 })
      const result = validator.validate(resp.data.data, getDocumentInfoResponseSchema.schema)
      assert(result.errors.length === 0)
      assert(resp.status === 200)
    })

    // 401 TODO

    // 400
    it('should return 400 status when document id is not passed', async() => {
      const resp = await http.get(getDocInfoUrl, { document_id: null })
      assert(resp.status === 400)
      assert(validator.validate(resp.data, errorResponseSchema.schema).errors.length === 0)
      assert(resp.data.code === GlobalErrorCodes.INVALID_PARAMETERS)
    })
  })
});
