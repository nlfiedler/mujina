//
// Copyright (c) 2017 Nathan Fiedler
//
const {combineReducers} = require('redux')
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

function years (
  state = {
    isPending: false,
    items: [],
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.GET_YEARS:
      return Object.assign({}, state, {
        isPending: true,
        error: null
      })
    case actions.GET_YEARS_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        items: action.years,
        error: null
      })
    case actions.GET_YEARS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.err
      })
    default:
      return state
  }
}

function locations (
  state = {
    isPending: false,
    items: [],
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.GET_LOCATIONS:
      return Object.assign({}, state, {
        isPending: true,
        error: null
      })
    case actions.GET_LOCATIONS_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        items: action.locations,
        error: null
      })
    case actions.GET_LOCATIONS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.err
      })
    default:
      return state
  }
}

exports.reducer = combineReducers({
  tags,
  years,
  locations
})
