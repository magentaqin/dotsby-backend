const assert = require('assert')
const { Validator } = require('jsonschema')
const http = require('@test/request')
const router = require('@app/modules/user/router')
const signupSchema = require('@schema/src/apis/user_signup_response')
const loginSchema = require('@schema/src/apis/user_login_response')
const errorResponseSchema = require('@schema/src/response/type_response_error')

const validator = new Validator()
const signupUrl = router.url('signUp');
const loginUrl = router.url('login')

describe('Test User Apis', async() => {
  const randomName = Math.random().toString(32).substr(2)
  const userForm = {
    email: `${randomName}@gmail.com`,
    password: 'test1234',
  }
  /**
   * Sign up
   */
  describe('Sign Up', async() => {
    // 200
    it('should return user info when sign up successfully', async() => {
      const resp = await http.post(signupUrl, userForm);
      const validationResult = validator.validate(resp.data.data, signupSchema.schema);
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
      const resp = await http.post(signupUrl, userForm);
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
    it('should return user info when login successfully', async() => {
      const resp = await http.post(loginUrl, userForm);
      const validationResult = validator.validate(resp.data.data, loginSchema.schema);
      assert(validationResult.errors.length === 0);
      assert(resp.status === 200);
    })
    // 400
    it('should return 400 status when validation failed', async() => {
      const resp = await http.post(loginUrl);
      const validationResult = validator.validate(resp.data.data, errorResponseSchema.schema);
      assert(validationResult.errors.length === 0);
      assert(resp.status === 400);
    })

    // 401
    it('should return 401 status when password does not match with email', async() => {
      userForm.password = 'haha1234';
      const resp = await http.post(loginUrl, userForm);
      const validationResult = validator.validate(resp.data.data, errorResponseSchema.schema);
      assert(validationResult.errors.length === 0);
      assert(resp.status === 401);
    })

    // 404
    it('should return 404 status when email does not exist', async() => {
      userForm.email = 'emaildoesnotexist@gmail.com';
      const resp = await http.post(loginUrl, userForm);
      const validationResult = validator.validate(resp.data.data, errorResponseSchema.schema);
      assert(validationResult.errors.length === 0);
      assert(resp.status === 404);
    })
  })

  /**
   * get user info
   */
  describe('Get User Info', async() => {
    // 200
    // 401
  })
})
