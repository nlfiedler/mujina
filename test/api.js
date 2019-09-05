//
// Copyright (c) 2019 Nathan Fiedler
//
const { assert } = require('chai')
const { afterEach, describe, it } = require('mocha')
const nock = require('nock')
const Api = require('../app/api')

describe('API', () => {
  describe('Attributes', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('retrieves tags from the backend', async function () {
      const expected = [
        { tag: 'audio', count: 1 },
        { tag: 'cake', count: 1 }
      ]
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .reply(200, {
          data: {
            tags: expected
          }
        })
      const results = await Api.fetchTags()
      assert.deepEqual(results, expected)
    })
  })

  describe('Uploads', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('uploads a file and receives an asset identifier', async function () {
      const sum1 = '095964d07f3e821659d4eb27ed9e20cd5160c53385562df727e98eb815bb371f'
      nock('http://localhost:3000')
        .post('/graphql', /upload/)
        .reply(200, { data: { upload: sum1 } })
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .reply(200, { data: { update: { tags: ['one', 'two'] } } })
      const result = await Api.uploadFile(
        {
          name: 'lorem-ipsum.txt',
          path: 'test/fixtures/lorem-ipsum.txt',
          type: 'text/plain',
          location: 'outside',
          tags: 'one,two'
        }
      )
      assert.deepEqual(result,
        {
          name: 'lorem-ipsum.txt',
          path: 'test/fixtures/lorem-ipsum.txt',
          type: 'text/plain',
          location: 'outside',
          tags: ['one', 'two'],
          identifier: sum1
        }
      )
    })
  })
})
