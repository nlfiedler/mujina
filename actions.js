//
// Copyright (c) 2017 Nathan Fiedler
//
const LOAD_TAGS = 'LOAD_TAGS'
const LOAD_TAGS_SUCCESS = 'LOAD_TAGS_SUCCESS'
const LOAD_TAGS_FAIL = 'LOAD_TAGS_FAIL'

function requestTags () {
  return {
    type: LOAD_TAGS
  }
}

function receiveTags (json) {
  return {
    type: LOAD_TAGS_SUCCESS,
    tags: json
    // receivedAt: Date.now()
  }
}

function failTags (err) {
  return {
    type: LOAD_TAGS_FAIL,
    err
  }
}

module.exports = {
  LOAD_TAGS,
  LOAD_TAGS_SUCCESS,
  LOAD_TAGS_FAIL,
  requestTags,
  receiveTags,
  failTags
}
