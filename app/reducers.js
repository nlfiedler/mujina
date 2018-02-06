//
// Copyright (c) 2017 Nathan Fiedler
//
const {combineReducers} = require('redux')
const actions = require('./actions')
const {routerReducer} = require('react-router-redux')
const {modelReducer, formReducer} = require('react-redux-form')

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
        isPending: true
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
        isPending: true
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
        isPending: true
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

function assets (
  state = {
    isPending: false,
    items: [],
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.GET_ASSETS:
      return Object.assign({}, state, {
        isPending: true
      })
    case actions.GET_ASSETS_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        items: action.payload.assets.map(item => {
          return {
            checksum: item.checksum,
            filename: item.file_name,
            // TODO: parse the asset date into a Date object
            date: item.date,
            location: item.location
          }
        }),
        error: null
      })
    case actions.GET_ASSETS_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        items: [],
        error: action.payload
      })
    default:
      return state
  }
}

function details (
  state = {
    isPending: false,
    single: {},
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.FETCH_ASSET:
      return Object.assign({}, state, {
        isPending: true
      })
    case actions.FETCH_ASSET_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        single: {
          checksum: action.payload.checksum,
          filename: action.payload.file_name,
          filesize: action.payload.file_size,
          // TODO: parse the asset date/time into a Date object
          datetime: action.payload.datetime,
          // avoid having null fields, the React components don't like it
          location: action.payload.location || '',
          mimetype: action.payload.mimetype,
          userdate: action.payload.user_date,
          caption: action.payload.caption || '',
          duration: action.payload.duration,
          tags: action.payload.tags
        },
        error: null
      })
    case actions.FETCH_ASSET_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        single: {},
        error: action.payload
      })
    case actions.UPDATE_ASSET:
      return Object.assign({}, state, {
        isPending: true,
        single: action.payload
      })
    case actions.UPDATE_ASSET_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        error: null
      })
    case actions.UPDATE_ASSET_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        error: action.payload
      })
    default:
      return state
  }
}

function uploads (
  state = {
    isPending: false,
    files: [],
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.DROP_FILES:
      return Object.assign({}, state, {
        isPending: true,
        files: action.payload
      })
    case actions.DROP_FILES_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        files: action.payload,
        error: null
      })
    case actions.DROP_FILES_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        error: action.payload
      })
    case actions.UPLOAD_FILES:
      return Object.assign({}, state, {
        isPending: true,
        files: action.payload
      })
    case actions.UPLOAD_FILES_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        files: action.payload,
        error: null
      })
    case actions.UPLOAD_FILES_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        error: action.payload
      })
    default:
      return state
  }
}

function errors (
  state = null,
  action
) {
  switch (action.type) {
    case actions.SET_ERROR:
      return action.payload
    default:
      return state
  }
}

function toggleActive (state, action) {
  return Object.assign({}, state, {
    items: state.items.map(item =>
      item.label === action.payload ? Object.assign({}, item, {active: !item.active}) : item
    )
  })
}

exports.reducer = combineReducers({
  errors,
  tags,
  years,
  locations,
  assets,
  details,
  uploads,
  router: routerReducer,
  drops: modelReducer('drops'),
  editor: modelReducer('editor'),
  options: modelReducer('options'),
  forms: formReducer('')
})
