//
// Copyright (c) 2017 Nathan Fiedler
//
const {createStore, applyMiddleware} = require('redux')
const createSagaMiddleware = require('redux-saga').default
const {reducer} = require('./reducers')
const {rootSaga} = require('./sagas')

exports.createStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducer,
    // initialState...
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(rootSaga)
  return store
}
