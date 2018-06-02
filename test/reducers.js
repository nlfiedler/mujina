//
// Copyright (c) 2017 Nathan Fiedler
//
const {assert} = require('chai')
const {afterEach, before, describe, it} = require('mocha')
const nock = require('nock')
const createInvariantMiddleware = require('redux-immutable-state-invariant').default
const actions = require('../app/actions')
const appStore = require('../app/store')

describe('Reducers', () => {
  let store = null

  before(() => {
    const middleware = [
      createInvariantMiddleware()
    ]
    store = appStore.configureStore({middleware})
  })

  describe('Tags', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('handles data fetch errors', (done) => {
      nock('http://localhost:3000')
        .post('/graphql')
        .reply(500)
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().tags
        // 1. called when fetching
        // 2. called again after fetch failed
        if (!state.isPending) {
          assert.isNotNull(state.error)
          assert.isEmpty(state.items)
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.requestTags())
    })

    it('fetches tags and updates the store', (done) => {
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .reply(200, {
          data: {
            tags: [
              {value: 'pie', count: 4},
              {value: 'cake', count: 2}
            ]
          }
        })
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().tags
        // 1. called when fetching
        // 2. called again after fetch complete, with items
        if (!state.isPending) {
          assert.deepEqual(state.items, [
            {label: 'pie', count: 4, active: false},
            {label: 'cake', count: 2, active: false}
          ])
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.requestTags())
    })

    it('sets a tag active by label', (done) => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().tags
        assert.deepEqual(state.items, [
          {label: 'pie', count: 4, active: true},
          {label: 'cake', count: 2, active: false}
        ])
        unsubscribe()
        done()
      })
      store.dispatch(actions.toggleTag('pie'))
    })
  })

  describe('Years', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('handles data fetch errors', (done) => {
      nock('http://localhost:3000')
        .post('/graphql')
        .reply(500)
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().years
        // 1. called when fetching
        // 2. called again after fetch failed
        if (!state.isPending) {
          assert.isNotNull(state.error)
          assert.isEmpty(state.items)
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.requestYears())
    })

    it('fetches years and updates the store', (done) => {
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .reply(200, {
          data: {
            years: [
              {value: 2007, count: 9},
              {value: 2015, count: 81}
            ]
          }
        })
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().years
        // 1. called when fetching
        // 2. called again after fetch complete, with items
        if (!state.isPending) {
          assert.deepEqual(state.items, [
            {label: '2007', count: 9, active: false},
            {label: '2015', count: 81, active: false}
          ])
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.requestYears())
    })

    it('sets a year active by label', (done) => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().years
        assert.deepEqual(state.items, [
          {label: '2007', count: 9, active: false},
          {label: '2015', count: 81, active: true}
        ])
        unsubscribe()
        done()
      })
      store.dispatch(actions.toggleYear('2015'))
    })
  })

  describe('Locations', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('handles data fetch errors', (done) => {
      nock('http://localhost:3000')
        .post('/graphql')
        .reply(500)
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().locations
        // 1. called when fetching
        // 2. called again after fetch failed
        if (!state.isPending) {
          assert.isNotNull(state.error)
          assert.isEmpty(state.items)
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.requestLocations())
    })

    it('fetches locations and updates the store', (done) => {
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .reply(200, {
          data: {
            locations: [
              {value: 'outside', count: 11},
              {value: 'inside', count: 5}
            ]
          }
        })
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().locations
        // 1. called when fetching
        // 2. called again after fetch complete, with items
        if (!state.isPending) {
          assert.deepEqual(state.items, [
            {label: 'outside', count: 11, active: false},
            {label: 'inside', count: 5, active: false}
          ])
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.requestLocations())
    })

    it('sets a location active by label', (done) => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().locations
        assert.deepEqual(state.items, [
          {label: 'outside', count: 11, active: false},
          {label: 'inside', count: 5, active: true}
        ])
        unsubscribe()
        done()
      })
      store.dispatch(actions.toggleLocation('inside'))
    })
  })

  describe('Uploads', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('processes file drops', (done) => {
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .times(2)
        .reply(200, {
          data: null
        })
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().uploads
        // 1. called when computing
        // 2. called again after checksum complete
        if (!state.isPending) {
          assert.equal(state.processed.length, 2)
          assert.equal(state.processed[0].path, 'test/fixtures/lorem-ipsum.txt')
          assert.equal(
            state.processed[0].checksum,
            '095964d07f3e821659d4eb27ed9e20cd5160c53385562df727e98eb815bb371f'
          )
          assert.equal(state.processed[0].mimetype, 'text/plain')
          assert.isNull(state.processed[0].image)
          assert.equal(state.processed[1].path, 'test/fixtures/128x128.png')
          assert.equal(
            state.processed[1].checksum,
            'ba2bba5f5a187efe6e0ec26614a1e04a44f4856186405991317a8d96780fd179'
          )
          assert.equal(state.processed[1].mimetype, 'image/png')
          assert.isTrue(state.processed[1].image.startsWith('data:image/jpg;base64,'))
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.dropFiles([
        {path: 'test/fixtures/lorem-ipsum.txt', mimetype: 'text/plain'},
        {path: 'test/fixtures/128x128.png', mimetype: 'image/png'}
      ]))
    })

    it('uploads a file and receives an asset identifier', (done) => {
      const sum1 = '095964d07f3e821659d4eb27ed9e20cd5160c53385562df727e98eb815bb371f'
      nock('http://localhost:3000')
        .post('/api/assets')
        .reply(200, {status: 'success', id: sum1})
      nock('http://localhost:3000')
        .post('/graphql', /query/)
        .reply(200, {data: {update: {location: 'outside', tags: ['one', 'two']}}})
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().uploads
        // 1. called when uploading
        // 2. called again after upload complete, with identifiers
        if (!state.isPending) {
          assert.equal(state.processed.length, 1)
          assert.equal(state.processed[0].name, 'lorem-ipsum.txt')
          assert.equal(state.processed[0].path, 'test/fixtures/lorem-ipsum.txt')
          assert.equal(state.processed[0].mimetype, 'text/plain')
          assert.equal(state.processed[0].location, 'outside')
          assert.deepEqual(state.processed[0].tags, ['one', 'two'])
          assert.equal(state.processed[0].identifier, sum1)
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.uploadFiles([
        {
          name: 'lorem-ipsum.txt',
          path: 'test/fixtures/lorem-ipsum.txt',
          mimetype: 'text/plain',
          location: 'outside',
          tags: ['one', 'two']
        }
      ]))
    })
  })
})
