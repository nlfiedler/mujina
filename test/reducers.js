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

  afterEach(() => {
    nock.cleanAll()
  })

  describe('Tags', () => {
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
        if (state.isPending) {
          assert.isNull(state.error)
        } else {
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
        if (state.isPending) {
          assert.isNull(state.error)
        } else {
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
        if (state.isPending) {
          assert.isNull(state.error)
        } else {
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
})
