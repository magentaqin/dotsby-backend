const assert = require('assert')

const http = require('@test/request')
const router = require('@app/modules/page/router')
const {
  pageValidator,
  getPageInfoSchema,
} = require('@app/schemas/apis/page')

const getPageInfoUrl = router.url('getPageInfo')

describe('Test Page Apis', async() => {
  /**
   * Get Page Info
   */
  describe('Get Page Info', async() => {
    // 200
    it('should return page info when page id is provided', async() => {
      const resp = await http.get(getPageInfoUrl, { id: 1 })
      const result = pageValidator.validate(resp.data.data, getPageInfoSchema)
      assert(result.errors.length === 0)
      assert(resp.status === 200)
    })
    // 400
    it('should return 400 status when id is not passed', async() => {
      const resp = await http.get(getPageInfoUrl)
      assert(resp.status === 400)
    })
    // 401
    // 403
    // 404
  })
})
