//
// Copyright (c) 2017 Nathan Fiedler
//
const TAG_FETCH_REQUESTED = 'TAG_FETCH_REQUESTED'
const TAG_FETCH_SUCCEEDED = 'TAG_FETCH_SUCCEEDED'
const TAG_FETCH_FAILED = 'TAG_FETCH_FAILED'

function requestTags () {
  return {
    type: TAG_FETCH_REQUESTED
  }
}

function receiveTags (json) {
  return {
    type: TAG_FETCH_SUCCEEDED,
    tags: json
    // receivedAt: Date.now()
  }
}

function failTags (err) {
  return {
    type: TAG_FETCH_FAILED,
    err
  }
}

module.exports = {
  TAG_FETCH_REQUESTED,
  TAG_FETCH_SUCCEEDED,
  TAG_FETCH_FAILED,
  requestTags,
  receiveTags,
  failTags
}
