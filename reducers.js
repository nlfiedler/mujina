//
// Copyright (c) 2017 Nathan Fiedler
//
const {
  LOAD_TAGS,
  LOAD_TAGS_SUCCESS,
  LOAD_TAGS_FAIL
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
    case LOAD_TAGS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        error: null
      })
    case LOAD_TAGS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.tags,
        error: null
      })
    case LOAD_TAGS_FAIL:
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
