//
// Copyright (c) 2017 Nathan Fiedler
//
const {createStore, applyMiddleware} = require('redux')
const createSagaMiddleware = require('redux-saga').default
const {reducer} = require('./reducers')
const {rootSaga} = require('./sagas')
const {
  forwardToMain,
  forwardToRenderer,
  getInitialStateRenderer,
  triggerAlias,
  replayActionMain,
  replayActionRenderer
} = require('electron-redux')

/**
 * Create the redux store with all middleware configured.
 *
 * @param {Object} arguments named arguments
 * @param {String} arguments.scope 'main' or 'renderer'; default 'main'
 * @param {Array} arguments.middleware list of optional middleware; default []
 * @return {Object} configured redux store
 */
exports.configureStore = ({middleware = [], scope = 'main'} = {}) => {
  const initialState = scope === 'main' ? {} : getInitialStateRenderer()
  const sagaMiddleware = createSagaMiddleware()
  const midware = scope === 'main' ? [
    triggerAlias,
    sagaMiddleware,
    ...middleware,
    forwardToRenderer
  ] : [
    forwardToMain,
    sagaMiddleware,
    ...middleware
  ]
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...midware)
  )
  sagaMiddleware.run(rootSaga)
  if (scope === 'main') {
    replayActionMain(store)
  } else {
    replayActionRenderer(store)
  }
  return store
}
