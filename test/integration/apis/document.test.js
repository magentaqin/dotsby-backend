const path = require('path')
const moduleAlias = require('module-alias')

moduleAlias.addAlias('@test', path.join(__dirname, '../../'))
moduleAlias.addAlias('@app', path.join(__dirname, '../../../app'))

const assert = require('assert')
const http = require('@test/request')
const router = require('@app/modules/document/router')
const { sampleDocument } = require('@test/sampleData')


const createDocUrl = router.url('createDocument')
const getDocInfoUrl = router.url('getDocumentInfo')

describe('Test Document APIS', async () => {
  /**
   * Create Document Api
   */
  describe('Create Document', async () => {
    // 200 OK
    it('should return document id and 200 status when document is created successfully', async() => {
      const resp = await http.post(createDocUrl, sampleDocument)
      assert(resp.data.data !== undefined)
      assert(resp.data.data.document_id !== undefined)
      assert(resp.status === 200)
    });

  //   // 401 TODO

  //   // 400 TODO
  });


  /**
   * Get Document Info Api
   */
  describe('Get Document Info', async() => {
    // 200 OK
    it('should return document info and 200 status when authorized', async() => {
      const resp = await http.get(getDocInfoUrl, { document_id: 1 })
      assert(resp.data.data !== undefined)
      assert(resp.status === 200)
    })

    // 401 TODO

    // 400
    it('should return 400 status when document id is not passed', async() => {
      const resp = await http.get(getDocInfoUrl)
      assert(resp.status === 400)
    })

  })
});
