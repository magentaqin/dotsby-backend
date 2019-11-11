const assert = require('assert')
const { Validator } = require('jsonschema');
const http = require('@test/request')
const router = require('@app/modules/document/router')
const { sampleDocument } = require('@test/sampleData')
const {
  createDocumentResponseSchema,
  getDocumentTokenResponseSchema,
  getDocumentInfoResponseSchema,
  documentValidator,
} = require('@app/schemas/apis/document')
const { errorResponseSchema } = require('@app/schemas/httpResponse')
const { GlobalErrorCodes } = require('@app/utils/errorMessages')

const validator = new Validator()

const getDocTokenUrl = router.url('getDocumentToken')
const createDocUrl = router.url('createDocument')
const getDocInfoUrl = router.url('getDocumentInfo')

describe('Test Document APIS', async () => {
  /**
   * Get Document Token Api
   */
  describe('Get Document Token', async() => {
    it('should return document token and 200 when authorized', async() => {
      const resp = await http.get(getDocTokenUrl)
      const result = documentValidator.validate(resp.data.data, getDocumentTokenResponseSchema)
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
    it('should return document id and 200 status when document is created successfully', async() => {
      const resp = await http.post(createDocUrl, sampleDocument)

      const validationResult = documentValidator
        .validate(
          resp.data.data,
          createDocumentResponseSchema,
        );
      assert(validationResult.errors.length === 0)
      assert(resp.status === 200)
    });

    // 400
    it('should return error code INVALID_PARAMETER and 400 status when query schema validation failed', async() => {
      const resp = await http.post(createDocUrl, {})
      assert(resp.status === 400)
      assert(validator.validate(resp.data, errorResponseSchema).errors.length === 0)
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
      const resp = await http.get(getDocInfoUrl, { document_id: 1 })
      const result = documentValidator.validate(resp.data.data, getDocumentInfoResponseSchema)
      assert(result.errors.length === 0)
      assert(resp.status === 200)
    })

    // 401 TODO

    // 400
    it('should return 400 status when document id is not passed', async() => {
      const resp = await http.get(getDocInfoUrl, { document_id: null })
      assert(resp.status === 400)
      assert(validator.validate(resp.data, errorResponseSchema).errors.length === 0)
      assert(resp.data.code === GlobalErrorCodes.INVALID_PARAMETERS)
    })
  })
});
