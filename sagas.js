//
// Copyright (c) 2017 Nathan Fiedler
//
const {all, call, put, takeEvery} = require('redux-saga/effects')
const Api = require('./api')
const actions = require('./actions')

function * fetchTags (action) {
  try {
    const json = yield call(Api.fetchTags)
    yield put(actions.receiveTags(json))
  } catch (err) {
    yield put(actions.failTags(err))
  }
}

function * watchFetchTags () {
  yield takeEvery(actions.LOAD_TAGS, fetchTags)
}

function * rootSaga () {
  yield all([
    watchFetchTags()
  ])
}

module.exports = {
  rootSaga
}
