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
        items: action.payload.map((item) => {
          return {
            label: item.tag,
            count: item.count,
            active: false
          }
        }),
        error: null
      })
    case actions.GET_TAGS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.payload
      })
    case actions.TOGGLE_TAG:
      return toggleActive(state, action)
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
        items: action.payload.map((item) => {
          return {
            label: item.year.toString(),
            count: item.count,
            active: false
          }
        }),
        error: null
      })
    case actions.GET_YEARS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.payload
      })
    case actions.TOGGLE_YEAR:
      return toggleActive(state, action)
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
        items: action.payload.map((item) => {
          return {
            label: item.location,
            count: item.count,
            active: false
          }
        }),
        error: null
      })
    case actions.GET_LOCATIONS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.payload
      })
    case actions.TOGGLE_LOCATION:
      return toggleActive(state, action)
    default:
      return state
  }
}

function toggleActive (state, action) {
  return Object.assign({}, state, {
    items: state.items.map(item =>
      // Need node.js 8.6 to have object spread operator support, so for now...
      // item.label === action.payload ? {...item, active: !item.active} : item
      item.label === action.payload ? Object.assign({}, item, {active: !item.active}) : item
    )
  })
}

exports.reducer = combineReducers({
  tags,
  years,
  locations
})
