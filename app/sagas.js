//
// Copyright (c) 2018 Nathan Fiedler
//
const {all, call, put, select, takeEvery, takeLatest} = require('redux-saga/effects')
const {push} = require('react-router-redux')
const Api = require('./api')
const actions = require('./actions')
const config = require('./config')
const {getSelectedAttrs} = require('./query')
const preview = require('./preview')

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
    // head to the upload screen immediately to show progress
    yield put(push('/upload'))
    for (let file of action.payload) {
      // file = {
      //   name,
      //   path,
      //   size,
      //   mimetype
      // }
      const checksum = yield call(Api.checksumFile, file.path)
      const dataUrl = yield call(preview.generateThumbnailData, file.path, file.mimetype)
      let entry = Object.assign({}, file, {
        checksum,
        image: dataUrl
      })
      const duplicate = yield call(Api.lookupAsset, checksum)
      // duplicate = {
      //   id
      //   caption
      //   location
      //   tags
      // }
      if (duplicate) {
        Object.assign(entry, duplicate, {
          identifier: duplicate.id
        })
      }
      yield put(actions.dropFilesProgress(entry))
    }
    // at the end, indicate all files received
    yield put(actions.receiveDropFiles())
  } catch (err) {
    yield put(actions.failDropFiles(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * uploadFiles (action) {
  try {
    let files = []
    for (let file of action.payload) {
      // fire the progress first to show that something is happening
      // during the time the file is uploading
      yield put(actions.uploadFilesProgress(files.length, file.name))
      // only upload if it does not already exist in storage
      if ('identifier' in file) {
        // the already existing file details will suffice
        files.push(file)
      } else {
        let newfile = yield call(Api.uploadFile, file)
        files.push(newfile)
      }
    }
    // fire one last time now that everything is uploaded
    yield put(actions.uploadFilesProgress(files.length, ''))
    yield put(actions.receiveUploadFiles(files))
    // need to update the selectors after uploading new assets
    yield put(actions.requestTags())
    yield put(actions.requestLocations())
    yield put(actions.requestYears())
    yield put(push('/'))
  } catch (err) {
    yield put(actions.failUploadFiles(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * handleSelection (action) {
  // Gather the selected attributes (years, locations, tags).
  const selections = yield select(getSelectedAttrs)
  try {
    // Start by indicating that assets are about to be queried, then start the
    // process of actually querying them.
    yield put(actions.requestAssets())
    const assets = yield call(Api.queryAssets, selections)
    yield put(actions.receiveAssets(assets))
  } catch (err) {
    yield put(actions.failAssets(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * searchAssets (action) {
  try {
    const assets = yield call(Api.searchAssets, action.payload)
    yield put(actions.receiveAssets(assets))
  } catch (err) {
    yield put(actions.failAssets(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * fetchAssetDetails (action) {
  try {
    const details = yield call(Api.fetchAsset, action.payload)
    yield put(actions.receiveAssetDetails(details))
    yield put(push('/asset/' + action.payload))
  } catch (err) {
    yield put(actions.failAssetDetails(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * updateAssetDetails (action) {
  try {
    const result = yield call(Api.updateAsset, action.payload)
    yield put(actions.receiveAssetUpdate(result))
    // go back to the asset detail page
    yield put(push('/asset/' + action.payload.identifier))
    yield put(actions.requestTags())
    yield put(actions.requestLocations())
    yield put(actions.requestYears())
  } catch (err) {
    yield put(actions.failAssetUpdate(err))
    yield put(actions.setError(err))
    yield put(push('/error'))
  }
}

function * saveOptions (action) {
  try {
    yield call(config.setOptions, action.payload)
    yield put(actions.requestTags())
    yield put(actions.requestLocations())
    yield put(actions.requestYears())
    yield put(push('/'))
  } catch (err) {
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

function * watchSelectorToggles () {
  yield takeLatest([
    actions.TOGGLE_LOCATION,
    actions.TOGGLE_TAG,
    actions.TOGGLE_YEAR,
    actions.RESET_FILTERS
  ], handleSelection)
}

function * watchFetchAsset () {
  yield takeLatest(actions.FETCH_ASSET, fetchAssetDetails)
}

function * watchSearchAssets () {
  yield takeLatest(actions.SEARCH_ASSETS, searchAssets)
}

function * watchUpdateAsset () {
  yield takeEvery(actions.UPDATE_ASSET, updateAssetDetails)
}

function * watchSaveOptions () {
  yield takeLatest(actions.SAVE_OPTIONS, saveOptions)
}

function * rootSaga () {
  yield all([
    watchFetchTags(),
    watchFetchYears(),
    watchFetchLocations(),
    watchSelectorToggles(),
    watchSearchAssets(),
    watchFetchAsset(),
    watchUpdateAsset(),
    watchDropFiles(),
    watchUploadFiles(),
    watchSaveOptions()
  ])
}

module.exports = {
  rootSaga
}
