//
// Copyright (c) 2017 Nathan Fiedler
//
const {assert} = require('chai')
const {afterEach, before, describe, it} = require('mocha')
const nock = require('nock')
const {createStore, applyMiddleware} = require('redux')
const createSagaMiddleware = require('redux-saga').default
const {reducer} = require('../reducers')
const actions = require('../actions')
const {rootSaga} = require('../sagas')

describe('tags reducer', () => {
  let store = null
  let unsubscribe = null

  before(() => {
    const sagaMiddleware = createSagaMiddleware()
    store = createStore(
      reducer,
      applyMiddleware(sagaMiddleware)
    )
    sagaMiddleware.run(rootSaga)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('fetches tags and updates the store', (done) => {
    const tags = [
      {tag: 'pie', count: 4},
      {tag: 'cake', count: 2}
    ]
    nock('http://localhost:3000')
      .get('/api/tags')
      .reply(200, tags)
    unsubscribe = store.subscribe(() => {
      const state = store.getState().tags
      // 1. called when fetching
      // 2. called again after fetch complete, with items
      if (state.isPending) {
        assert.isNull(state.error)
      } else {
        assert.deepEqual(state.items, tags)
        unsubscribe()
        done()
      }
    })
    store.dispatch(actions.requestTags())
  })
})

describe('years reducer', () => {
  let store = null
  let unsubscribe = null

  before(() => {
    const sagaMiddleware = createSagaMiddleware()
    store = createStore(
      reducer,
      applyMiddleware(sagaMiddleware)
    )
    sagaMiddleware.run(rootSaga)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('fetches years and updates the store', (done) => {
    const years = [
      {year: 2007, count: 9},
      {year: 2015, count: 81}
    ]
    nock('http://localhost:3000')
      .get('/api/years')
      .reply(200, years)
    unsubscribe = store.subscribe(() => {
      const state = store.getState().years
      // 1. called when fetching
      // 2. called again after fetch complete, with items
      if (state.isPending) {
        assert.isNull(state.error)
      } else {
        assert.deepEqual(state.items, years)
        unsubscribe()
        done()
      }
    })
    store.dispatch(actions.requestYears())
  })
})

describe('locations reducer', () => {
  let store = null
  let unsubscribe = null

  before(() => {
    const sagaMiddleware = createSagaMiddleware()
    store = createStore(
      reducer,
      applyMiddleware(sagaMiddleware)
    )
    sagaMiddleware.run(rootSaga)
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('fetches locations and updates the store', (done) => {
    const locations = [
      {location: 'outside', count: 11},
      {location: 'inside', count: 5}
    ]
    nock('http://localhost:3000')
      .get('/api/locations')
      .reply(200, locations)
    unsubscribe = store.subscribe(() => {
      const state = store.getState().locations
      // 1. called when fetching
      // 2. called again after fetch complete, with items
      if (state.isPending) {
        assert.isNull(state.error)
      } else {
        assert.deepEqual(state.items, locations)
        unsubscribe()
        done()
      }
    })
    store.dispatch(actions.requestLocations())
  })
})
