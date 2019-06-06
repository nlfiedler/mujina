//
// Copyright (c) 2019 Nathan Fiedler
//
const { createStore, applyMiddleware } = require('redux')
const createSagaMiddleware = require('redux-saga').default
const { reducer } = require('./reducers')
const { rootSaga } = require('./sagas')
const createHistory = require('history').createMemoryHistory
const { createLogger } = require('redux-logger')

exports.history = createHistory()

// Detect if we are running in development mode or not.
const isDevMode = process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath)

/**
 * Create the redux store with all middleware configured.
 *
 * @param {Object} arguments named arguments
 * @param {Array} arguments.middleware list of optional middleware; default []
 * @return {Object} configured redux store
 */
exports.configureStore = ({ middleware = [] } = {}) => {
  const initialState = {}
  const sagaMiddleware = createSagaMiddleware()
  // Make a copy of the provided middleware and then make the necessary
  // adjustments for the router and logging middleware.
  const midware = Array.from(middleware)
  midware.unshift(sagaMiddleware)
  if (isDevMode && process.env.NODE_ENV !== 'test') {
    midware.push(createLogger())
  }
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...midware)
  )
  sagaMiddleware.run(rootSaga)
  return store
}
