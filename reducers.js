//
// Copyright (c) 2017 Nathan Fiedler
//
const {
  INVALIDATE_TAGS,
  TAG_FETCH_REQUESTED,
  TAG_FETCH_SUCCEEDED,
  TAG_FETCH_FAILED
} = require('../actions')

function tags (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
    error: null
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_TAGS:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case TAG_FETCH_REQUESTED:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        error: null
      })
    case TAG_FETCH_SUCCEEDED:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.tags,
        error: null
      })
    case TAG_FETCH_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: [],
        error: action.err
      })
    default:
      return state
  }
}

module.exports = {
  tags
}
