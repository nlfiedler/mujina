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
      const state = store.getState()
      // 1. called when fetching
      // 2. called again after fetch complete, with items
      if (state.isFetching) {
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
