const assert = require('assert')
const http = require('@test/request')
const router = require('@app/modules/user/router')
const { Validator } = require('jsonschema')

const validator = new Validator()

describe('Test User Apis', async() => {
  /**
   * Sign up
   */
  describe('Sign Up', async() => {
    // 200
    it('should return user info when sign up successfully', async() => {

    })
    // 400
    it('should return 400 status when validation failed', async() => {

    })
    // 409.
    it('should return 409 status when user already existed', async () => {

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
