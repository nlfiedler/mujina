//
// Copyright (c) 2018 Nathan Fiedler
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
            label: item.value,
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
    case actions.RESET_FILTERS:
      return resetSelections(state)
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
            label: item.value.toString(),
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
      return toggleActive(state, action, true)
    case actions.RESET_FILTERS:
      return resetSelections(state)
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
            label: item.value,
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
    case actions.RESET_FILTERS:
      return resetSelections(state)
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
        items: action.payload.results.map(item => {
          return {
            identifier: item.id,
            filename: item.filename,
            datetime: new Date(item.datetime),
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
      const userdate = action.payload.userdate ? (
        new Date(action.payload.userdate)
      ) : null
      return Object.assign({}, state, {
        isPending: false,
        single: {
          identifier: action.payload.id,
          filename: action.payload.filename,
          filesize: action.payload.filesize,
          datetime: new Date(action.payload.datetime),
          // avoid having null fields, the React components don't like it
          location: action.payload.location || '',
          mimetype: action.payload.mimetype,
          caption: action.payload.caption || '',
          duration: action.payload.duration,
          tags: action.payload.tags,
          userdate
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
        single: Object.assign({}, action.payload)
      })
    case actions.UPDATE_ASSET_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        single: Object.assign({}, state.single, {
          // user may have changed custom date/time
          datetime: new Date(action.payload.datetime),
          // server may have modified the tags during update
          tags: Array.from(action.payload.tags)
        }),
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
    incoming: [],
    pending: [],
    outgoing: [],
    progress: null,
    error: null
  },
  action
) {
  switch (action.type) {
    case actions.DROP_FILES:
      return Object.assign({}, state, {
        isPending: true,
        incoming: action.payload.map(item => Object.assign({}, item)),
        // wipe out the previous upload progress
        progress: null
      })
    case actions.DROP_FILES_PROGRESS:
      if (state.pending.some(e => e.checksum === action.payload.checksum)) {
        return state
      }
      return Object.assign({}, state, {
        pending: state.pending.concat(Object.assign({}, action.payload))
      })
    case actions.DROP_FILES_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        incoming: [],
        error: null
      })
    case actions.DROP_FILES_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        incoming: [],
        error: action.payload
      })
    case actions.UPLOAD_FILES:
      return Object.assign({}, state, {
        isPending: true,
        outgoing: action.payload.map(item => Object.assign({}, item))
      })
    case actions.UPLOAD_FILES_PROGRESS:
      return Object.assign({}, state, {
        // no need to clone this one-off payload hidden inside actions module
        progress: action.payload
      })
    case actions.UPLOAD_FILES_FULFILLED:
      return Object.assign({}, state, {
        isPending: false,
        pending: [],
        outgoing: [],
        error: null
      })
    case actions.UPLOAD_FILES_REJECTED:
      return Object.assign({}, state, {
        isPending: false,
        pending: [],
        outgoing: [],
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

/**
 * Flip the active flag on the item whose label matches the action payload.
 *
 * @param {Object} state - current sub-state to operate on (tags, years, etc).
 * @param {Object} action - the action being performed (e.g. TOGGLE_TAG).
 * @param {bool} exclusive - if true, maintains at most one selection.
 * @return {Object} copy of state with changes applied.
 */
function toggleActive (state, action, exclusive = false) {
  return Object.assign({}, state, {
    items: state.items.map(item => {
      if (item.label === action.payload) {
        return Object.assign({}, item, {active: !item.active})
      } else if (exclusive && item.active) {
        return Object.assign({}, item, {active: false})
      } else {
        return item
      }
    })
  })
}

function resetSelections (state) {
  return Object.assign({}, state, {
    items: state.items.map(item => Object.assign({}, item, {active: false}))
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
