//
// Copyright (c) 2017 Nathan Fiedler
//
const {assert} = require('chai')
const {describe, it} = require('mocha')
const actions = require('../app/actions')
const configureStore = require('redux-mock-store')
const createSagaMiddleware = require('redux-saga').default
const {rootSaga} = require('../app/sagas')

// set up the mock redux store
const sagaMiddleware = createSagaMiddleware()
const mockStore = configureStore([sagaMiddleware])

describe('Async Actions', () => {
  it('creates fetch and success actions', (done) => {
    const store = mockStore({})
    sagaMiddleware.run(rootSaga)
    const expectedActions = [
      {type: actions.GET_TAGS, payload: null}
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
})

describe('Actions', () => {
  it('should create an action to fetch tags', () => {
    const expectedAction = {
      type: actions.GET_TAGS,
      payload: null
    }
    assert.deepEqual(actions.requestTags(), expectedAction)
  })

  it('should create an action to fail tag request', () => {
    const errMsg = 'oh no'
    const expectedAction = {
      type: actions.GET_TAGS_REJECTED,
      payload: errMsg,
      error: true
    }
    assert.deepEqual(actions.failTags(errMsg), expectedAction)
  })

  it('should create an action to receive tags', () => {
    const json = '[{"tag":"pie","count":4},{"tag":"cake","count":2}]'
    const expectedAction = {
      type: actions.GET_TAGS_FULFILLED,
      payload: json
    }
    assert.deepEqual(actions.receiveTags(json), expectedAction)
  })
})
