const assert = require('assert')
const { Validator } = require('jsonschema');
const http = require('@test/request')
const router = require('@app/modules/document/router')
const userRouter = require('@app/modules/user/router')
const { sampleDocument } = require('@test/sampleData')
const publishDocumentResponseSchema = require('@schema/src/apis/document_publish_response')
const getDocumentInfoResponseSchema = require('@schema/src/apis/document_info_response')
const createDocumentSchema = require('@schema/src/apis/document_create_response')
const errorResponseSchema = require('@schema/src/response/type_response_error')
const { GlobalErrorCodes } = require('@app/utils/errorMessages')

const validator = new Validator()

const createDocumentUrl = router.url('createDocument')
const publishDocumentUrl = router.url('publishDocument')
const getDocInfoUrl = router.url('getDocumentInfo')
const signupUrl = userRouter.url('signUp')

describe('Test Document APIS', async () => {
  const randomName = Math.random().toString(32).substr(2)
  const userForm = {
    email: `${randomName}@gmail.com`,
    password: 'test1234',
  }
  const signupResp = await http.post(signupUrl, userForm);
  const { token } = signupResp.data.data;
  const authHeader = { Authorization: token };
  /**
   * Create Document Api
   */
  describe('Create Document', async() => {
    // 200
    it('should return document_id and 200 when authorized', async() => {
      const resp = await http.post(createDocumentUrl, { title: 'Test Document', version: '0.1.0' }, authHeader)
      const result = validator.validate(resp.data.data, createDocumentSchema.schema)
      assert(result.errors.length === 0)
      assert(resp.status === 200)
    })

    // 400
    it('should return error code INVALID_PARAMETER and 400 status when query schema validation failed', async() => {
      const resp = await http.post(createDocumentUrl, {}, authHeader)
      assert(resp.status === 400)
      assert(validator.validate(resp.data, errorResponseSchema.schema).errors.length === 0)
      assert(resp.data.code === GlobalErrorCodes.INVALID_PARAMETERS)
    })

    // 401
    it('should return 401 status when authorized', async() => {
      const resp = await http.post(createDocumentUrl)
      const result = validator.validate(resp.data.data, errorResponseSchema.schema)
      assert(result.errors.length === 0)
      assert(resp.status === 401)
    })
  })

  /**
   * Publish Document Api
   */
  describe('Publish Document', async () => {
    // 200 OK
    it('should return id and version and 200 status when document is published successfully', async() => {
      const resp = await http.post(publishDocumentUrl, sampleDocument)

      const validationResult = validator
        .validate(
          resp.data.data,
          publishDocumentResponseSchema.schema,
        );
      assert(validationResult.errors.length === 0)
      assert(resp.status === 200)
    });

    // 400
    it('should return error code INVALID_PARAMETER and 400 status when query schema validation failed', async() => {
      const resp = await http.post(publishDocumentUrl, {})
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
