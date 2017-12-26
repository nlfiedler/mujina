//
// Copyright (c) 2017 Nathan Fiedler
//
const {createAliasedAction} = require('electron-redux')

exports.GET_TAGS = 'GET_TAGS'
exports.GET_TAGS_FULFILLED = 'GET_TAGS_FULFILLED'
exports.GET_TAGS_REJECTED = 'GET_TAGS_REJECTED'

exports.requestTags = createAliasedAction(
  exports.GET_TAGS,
  () => ({
    type: exports.GET_TAGS,
    payload: null
  })
)

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

exports.requestYears = createAliasedAction(
  exports.GET_YEARS,
  () => ({
    type: exports.GET_YEARS,
    payload: null
  })
)

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

exports.requestLocations = createAliasedAction(
  exports.GET_LOCATIONS,
  () => ({
    type: exports.GET_LOCATIONS,
    payload: null
  })
)

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
