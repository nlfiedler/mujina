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
