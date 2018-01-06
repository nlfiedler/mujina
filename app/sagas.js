//
// Copyright (c) 2017 Nathan Fiedler
//
const {all, call, put, takeEvery, takeLatest} = require('redux-saga/effects')
const {push} = require('react-router-redux')
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

function * fetchYears (action) {
  try {
    const json = yield call(Api.fetchYears)
    yield put(actions.receiveYears(json))
  } catch (err) {
    yield put(actions.failYears(err))
  }
}

function * fetchLocations (action) {
  try {
    const json = yield call(Api.fetchLocations)
    yield put(actions.receiveLocations(json))
  } catch (err) {
    yield put(actions.failLocations(err))
  }
}

function * checksumDrops (action) {
  try {
    const files = yield call(Api.checksumFiles, action.payload)
    yield put(actions.receiveDropFiles(files))
    yield put(push('/upload'))
  } catch (err) {
    yield put(actions.failDropFiles(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * uploadFiles (action) {
  try {
    const files = yield call(Api.uploadFiles, action.payload)
    yield put(actions.receiveUploadFiles(files))
    yield put(push('/'))
  } catch (err) {
    yield put(actions.failUploadFiles(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * watchFetchTags () {
  yield takeLatest(actions.GET_TAGS, fetchTags)
}

function * watchFetchYears () {
  yield takeLatest(actions.GET_YEARS, fetchYears)
}

function * watchFetchLocations () {
  yield takeLatest(actions.GET_LOCATIONS, fetchLocations)
}

function * watchDropFiles () {
  yield takeEvery(actions.DROP_FILES, checksumDrops)
}

function * watchUploadFiles () {
  yield takeEvery(actions.UPLOAD_FILES, uploadFiles)
}

function * rootSaga () {
  yield all([
    watchFetchTags(),
    watchFetchYears(),
    watchFetchLocations(),
    watchDropFiles(),
    watchUploadFiles()
  ])
}

module.exports = {
  rootSaga
}
