//
// Copyright (c) 2017 Nathan Fiedler
//
const {createStore, applyMiddleware} = require('redux')
const createSagaMiddleware = require('redux-saga').default
const {reducer} = require('./reducers')
const {rootSaga} = require('./sagas')
const {routerMiddleware} = require('react-router-redux')
const createHistory = require('history/createMemoryHistory').default
const {createLogger} = require('redux-logger')

exports.history = createHistory()

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
  // Make a copy of the provided middleware and then make the necessary
  // adjustments for the router and logging middleware.
  const midware = Array.from(middleware)
  midware.unshift(sagaMiddleware)
  midware.push(routerMiddleware(exports.history))
  if (process.env.NODE_ENV === 'development') {
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
