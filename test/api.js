//
// Copyright (c) 2017 Nathan Fiedler
//
const {assert} = require('chai')
const {afterEach, describe, it} = require('mocha')
const nock = require('nock')
const Api = require('../app/api')

// TODO: write a test for api.updateAsset()
describe('API', () => {
  describe('Attributes', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('retrieves tags from the backend', async function () {
      const expected = [
        {'tag': 'audio', 'count': 1},
        {'tag': 'cake', 'count': 1}
      ]
      nock('http://localhost:3000')
        .get('/api/tags')
        .reply(200, expected)
      const results = await Api.fetchTags()
      assert.deepEqual(results, expected)
    })
  })

  describe('Uploads', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('uploads a file and receives an asset checksum', async function () {
      const sum1 = '095964d07f3e821659d4eb27ed9e20cd5160c53385562df727e98eb815bb371f'
      nock('http://localhost:3000')
        .post('/api/assets')
        .reply(200, {status: 'success', id: sum1})
      nock('http://localhost:3000')
        .put(`/api/assets/${sum1}`)
        .reply(200, {status: 'success'})
      const results = await Api.uploadFiles([
        {
          name: 'lorem-ipsum.txt',
          path: 'test/fixtures/lorem-ipsum.txt',
          type: 'text/plain',
          location: 'outside',
          tags: 'one,two'
        }
      ])
      assert.deepEqual(results, [
        {
          name: 'lorem-ipsum.txt',
          path: 'test/fixtures/lorem-ipsum.txt',
          type: 'text/plain',
          location: 'outside',
          tags: 'one,two',
          checksum: sum1
        }
      ])
    })
  })
})
