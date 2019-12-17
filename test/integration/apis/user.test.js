const assert = require('assert')
const { Validator } = require('jsonschema')
const http = require('@test/request')
const router = require('@app/modules/user/router')
const signupSchema = require('@schema/src/apis/user_signup_response')
const errorResponseSchema = require('@schema/src/response/type_response_error')

const validator = new Validator()
const signupUrl = router.url('signUp');
const loginUrl = router.url('login')

describe('Test User Apis', async() => {
  /**
   * Sign up
   */
  describe('Sign Up', async() => {
    const randomName = Math.random().toString(32).substr(2)
    const signupForm = {
      email: `${randomName}@gmail.com`,
      password: 'test1234',
    }
    // 200
    it('should return user info when sign up successfully', async() => {
      const resp = await http.post(signupUrl, signupForm);
      const validationResult = validator.validate(resp.data.data, signupSchema.schema);
      console.log(validationResult.errors)
      assert(validationResult.errors.length === 0);
      assert(resp.status === 200);
    })
    // 400
    it('should return 400 status when validation failed', async() => {
      const resp = await http.post(signupUrl);
      const validationResult = validator.validate(resp.data.data, errorResponseSchema.schema);
      assert(validationResult.errors.length === 0);
      assert(resp.status === 400);
    })
    // 409.
    it('should return 409 status when user already existed', async () => {
      const resp = await http.post(signupUrl, signupForm);
      const validationResult = validator.validate(resp.data.data, errorResponseSchema.schema);
      assert(validationResult.errors.length === 0);
      assert(resp.status === 409);
    })
  })

  /**
   * Login
   */
  describe('Login', async() => {
    // 200
    // 400
    // 401
  })

  /**
   * get user info
   */
  describe('Get User Info', async() => {
    // 200
    // 401
  })
})
