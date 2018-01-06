//
// Copyright (c) 2017 Nathan Fiedler
//
exports.GET_TAGS = 'GET_TAGS'
exports.GET_TAGS_FULFILLED = 'GET_TAGS_FULFILLED'
exports.GET_TAGS_REJECTED = 'GET_TAGS_REJECTED'

exports.requestTags = () => {
  return {
    type: exports.GET_TAGS,
    payload: null
  }
}

exports.receiveTags = (json) => {
  return {
    type: exports.GET_TAGS_FULFILLED,
    payload: json
  }
}

exports.failTags = (err) => {
  return {
    type: exports.GET_TAGS_REJECTED,
    payload: err,
    error: true
  }
}

exports.GET_YEARS = 'GET_YEARS'
exports.GET_YEARS_FULFILLED = 'GET_YEARS_FULFILLED'
exports.GET_YEARS_REJECTED = 'GET_YEARS_REJECTED'

exports.requestYears = () => {
  return {
    type: exports.GET_YEARS,
    payload: null
  }
}

exports.receiveYears = (json) => {
  return {
    type: exports.GET_YEARS_FULFILLED,
    payload: json
  }
}

exports.failYears = (err) => {
  return {
    type: exports.GET_YEARS_REJECTED,
    payload: err,
    error: true
  }
}

exports.GET_LOCATIONS = 'GET_LOCATIONS'
exports.GET_LOCATIONS_FULFILLED = 'GET_LOCATIONS_FULFILLED'
exports.GET_LOCATIONS_REJECTED = 'GET_LOCATIONS_REJECTED'

exports.requestLocations = () => {
  return {
    type: exports.GET_LOCATIONS,
    payload: null
  }
}

exports.receiveLocations = (json) => {
  return {
    type: exports.GET_LOCATIONS_FULFILLED,
    payload: json
  }
}

exports.failLocations = (err) => {
  return {
    type: exports.GET_LOCATIONS_REJECTED,
    payload: err,
    error: true
  }
}

exports.TOGGLE_TAG = 'TOGGLE_TAG'

exports.toggleTag = (label) => {
  return {
    type: exports.TOGGLE_TAG,
    payload: label
  }
}

exports.TOGGLE_YEAR = 'TOGGLE_YEAR'

exports.toggleYear = (label) => {
  return {
    type: exports.TOGGLE_YEAR,
    payload: label
  }
}

exports.TOGGLE_LOCATION = 'TOGGLE_LOCATION'

exports.toggleLocation = (label) => {
  return {
    type: exports.TOGGLE_LOCATION,
    payload: label
  }
}

exports.DROP_FILES = 'DROP_FILES'
exports.dropFiles = (files) => {
  return {
    type: exports.DROP_FILES,
    payload: files
  }
}

exports.DROP_FILES_FULFILLED = 'DROP_FILES_FULFILLED'
exports.receiveDropFiles = (files) => {
  return {
    type: exports.DROP_FILES_FULFILLED,
    payload: files
  }
}

exports.DROP_FILES_REJECTED = 'DROP_FILES_REJECTED'
exports.failDropFiles = (err) => {
  return {
    type: exports.DROP_FILES_REJECTED,
    payload: err,
    error: true
  }
}

exports.UPLOAD_FILES = 'UPLOAD_FILES'
exports.uploadFiles = (files) => {
  return {
    type: exports.UPLOAD_FILES,
    payload: files
  }
}

exports.UPLOAD_FILES_FULFILLED = 'UPLOAD_FILES_FULFILLED'
exports.receiveUploadFiles = (files) => {
  return {
    type: exports.UPLOAD_FILES_FULFILLED,
    payload: files
  }
}

exports.UPLOAD_FILES_REJECTED = 'UPLOAD_FILES_REJECTED'
exports.failUploadFiles = (err) => {
  return {
    type: exports.UPLOAD_FILES_REJECTED,
    payload: err,
    error: true
  }
}

// Set a global error for the error page to display.
exports.SET_ERROR = 'SET_ERROR'
exports.setError = (err) => {
  return {
    type: exports.SET_ERROR,
    payload: err,
    error: true
  }
}
