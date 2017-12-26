//
// Copyright (c) 2017 Nathan Fiedler
//
const actions = require('./actions')

function tags (
  state = {
    isPending: false,
    items: [],
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.GET_TAGS:
      return Object.assign({}, state, {
        isPending: true,
        error: null
      })
    case actions.GET_TAGS_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        items: action.tags,
        error: null
      })
    case actions.GET_TAGS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.err
      })
    default:
      return state
  }
}

module.exports = {
  reducer: tags
}
