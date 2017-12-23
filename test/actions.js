//
// Copyright (c) 2017 Nathan Fiedler
//
const {assert} = require('chai')
const {afterEach, describe, it} = require('mocha')
const nock = require('nock')
const actions = require('../actions')
const Api = require('../api')
const configureStore = require('redux-mock-store').default
const createSagaMiddleware = require('redux-saga').default
const {rootSaga} = require('../sagas')

// set up the mock redux store
const sagaMiddleware = createSagaMiddleware()
const mockStore = configureStore([sagaMiddleware])

describe('Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('creates fetch and success actions', (done) => {
    const tags = [
      {tag: 'pie', count: 4},
      {tag: 'cake', count: 2}
    ]
    nock('http://localhost:3000')
      .get('/api/tags')
      .reply(200, tags)
    const store = mockStore({})
    sagaMiddleware.run(rootSaga)
    const expectedActions = [
      {type: actions.TAG_FETCH_REQUESTED},
      {type: actions.TAG_FETCH_SUCCEEDED, tags}
    ]
    store.subscribe(() => {
      // once both actions have dispatched, then compare
      const actions = store.getActions()
      if (actions.length === expectedActions.length) {
        assert.deepEqual(actions, expectedActions)
        done()
      }
    })
    store.dispatch(actions.requestTags())
  })

  it('fetches tags via HTTP', async function () {
    const tags = [
      {tag: 'pie', count: 4},
      {tag: 'cake', count: 2}
    ]
    nock('http://localhost:3000')
      .get('/api/tags')
      .reply(200, tags)
    const result = await Api.fetchTags()
    assert.deepEqual(result, tags)
  })
})

describe('Actions', () => {
  it('should create an action to fetch tags', () => {
    const expectedAction = {
      type: actions.TAG_FETCH_REQUESTED
    }
    assert.deepEqual(actions.requestTags(), expectedAction)
  })

  it('should create an action to fail tag request', () => {
    const errMsg = 'oh no'
    const expectedAction = {
      type: actions.TAG_FETCH_FAILED,
      err: errMsg
    }
    assert.deepEqual(actions.failTags(errMsg), expectedAction)
  })

  it('should create an action to receive tags', () => {
    const json = '[{"tag":"pie","count":4},{"tag":"cake","count":2}]'
    const expectedAction = {
      type: actions.TAG_FETCH_SUCCEEDED,
      tags: json
    }
    assert.deepEqual(actions.receiveTags(json), expectedAction)
  })
})
