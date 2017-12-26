//
// Copyright (c) 2017 Nathan Fiedler
//
exports.GET_TAGS = 'GET_TAGS'
exports.GET_TAGS_FULFILLED = 'GET_TAGS_FULFILLED'
exports.GET_TAGS_REJECTED = 'GET_TAGS_REJECTED'

exports.requestTags = () => {
  return {
    type: exports.GET_TAGS
  }
}

exports.receiveTags = (json) => {
  return {
    type: exports.GET_TAGS_FULFILLED,
    tags: json
  }
}

exports.failTags = (err) => {
  return {
    type: exports.GET_TAGS_REJECTED,
    err
  }
}

exports.GET_YEARS = 'GET_YEARS'
exports.GET_YEARS_FULFILLED = 'GET_YEARS_FULFILLED'
exports.GET_YEARS_REJECTED = 'GET_YEARS_REJECTED'

exports.requestYears = () => {
  return {
    type: exports.GET_YEARS
  }
}

exports.receiveYears = (json) => {
  return {
    type: exports.GET_YEARS_FULFILLED,
    years: json
  }
}

exports.failYears = (err) => {
  return {
    type: exports.GET_YEARS_REJECTED,
    err
  }
}

exports.GET_LOCATIONS = 'GET_LOCATIONS'
exports.GET_LOCATIONS_FULFILLED = 'GET_LOCATIONS_FULFILLED'
exports.GET_LOCATIONS_REJECTED = 'GET_LOCATIONS_REJECTED'

exports.requestLocations = () => {
  return {
    type: exports.GET_LOCATIONS
  }
}

exports.receiveLocations = (json) => {
  return {
    type: exports.GET_LOCATIONS_FULFILLED,
    locations: json
  }
}

exports.failLocations = (err) => {
  return {
    type: exports.GET_LOCATIONS_REJECTED,
    err
  }
}
