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
        .get('/api/tags')
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
        .get('/api/tags')
        .reply(200, [
          {tag: 'pie', count: 4},
          {tag: 'cake', count: 2}
        ])
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
        .get('/api/years')
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
        .get('/api/years')
        .reply(200, [
          {year: 2007, count: 9},
          {year: 2015, count: 81}
        ])
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
        .get('/api/locations')
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
        .get('/api/locations')
        .reply(200, [
          {location: 'outside', count: 11},
          {location: 'inside', count: 5}
        ])
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

    it('computes checksum of file paths', (done) => {
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().uploads
        // 1. called when computing
        // 2. called again after checksum complete
        if (!state.isPending) {
          assert.deepEqual(state.files, [
            {
              path: 'app/containers/DroppedFiles.js',
              kagi: 'd26aa8cc2cf64e36910bcb67f994897c11cb9e37'
            },
            {
              path: 'assets/images/128x128.png',
              kagi: 'e3b790af8d990325138be8e7ec59c86bee5e13ff'
            }
          ])
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.dropFiles([
        {path: 'app/containers/DroppedFiles.js'},
        {path: 'assets/images/128x128.png'}
      ]))
    })

    it('uploads a file and receives an asset checksum', (done) => {
      const sum1 = '095964d07f3e821659d4eb27ed9e20cd5160c53385562df727e98eb815bb371f'
      nock('http://localhost:3000')
        .post('/api/assets')
        .reply(200, {status: 'success', id: sum1})
      nock('http://localhost:3000')
        .put(`/api/assets/${sum1}`)
        .reply(200, {status: 'success'})
      const unsubscribe = store.subscribe(() => {
        const state = store.getState().uploads
        // 1. called when uploading
        // 2. called again after upload complete, with checksums
        if (!state.isPending) {
          assert.deepEqual(state.files, [
            {
              name: 'lorem-ipsum.txt',
              path: 'test/fixtures/lorem-ipsum.txt',
              type: 'text/plain',
              location: 'outside',
              tags: 'one,two',
              checksum: sum1
            }
          ])
          unsubscribe()
          done()
        }
      })
      store.dispatch(actions.uploadFiles([
        {
          name: 'lorem-ipsum.txt',
          path: 'test/fixtures/lorem-ipsum.txt',
          type: 'text/plain',
          location: 'outside',
          tags: 'one,two'
        }
      ]))
    })
  })
})
