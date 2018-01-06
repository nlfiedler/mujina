//
// Copyright (c) 2017 Nathan Fiedler
//
const {createStore, applyMiddleware} = require('redux')
const createSagaMiddleware = require('redux-saga').default
const {reducer} = require('./reducers')
const {rootSaga} = require('./sagas')

/**
 * Create the redux store with all middleware configured.
 *
 * @param {Object} arguments named arguments
 * @param {Array} arguments.middleware list of optional middleware; default []
 * @return {Object} configured redux store
 */
exports.configureStore = ({middleware = []} = {}) => {
  const initialState = {}
  const sagaMiddleware = createSagaMiddleware()
  const midware = [
    sagaMiddleware,
    ...middleware
  ]
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...midware)
  )
  sagaMiddleware.run(rootSaga)
  return store
}
