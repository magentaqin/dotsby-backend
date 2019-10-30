const path = require('path')
const moduleAlias = require('module-alias')
moduleAlias.addAlias('@test', path.join(__dirname, '../../'))
moduleAlias.addAlias('@app', path.join(__dirname, '../../../app'))

const assert = require('assert')
const http = require('@test/request')
const router = require('@app/modules/document/router')
const { sampleDocument } = require('@test/sampleData')


const createDocUrl = router.url('createDocument')

describe('Test Document APIS', async () => {

  /**
   * Create Document Api
   */
  describe('Create Document', async () => {
    // 200 ok
    it('should return document id and 200 status when document is created successfully', async() => {
      const resp = await http.post(createDocUrl, sampleDocument)
      assert(resp.data.data !== undefined)
      assert(resp.data.data.document_id !== undefined)
      assert(resp.status === 200)
    });
  });



});
