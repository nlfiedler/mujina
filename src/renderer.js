//
// Copyright (c) 2019 Nathan Fiedler
//
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//
const React = require('react')
const ReactDOM = require('react-dom')
const { Provider } = require('react-redux')
const { App } = require('./components/App')
const actions = require('./actions')
const { configureStore } = require('./store')
const { ipcRenderer } = require('electron')
const { history } = require('./api')

const reduxStore = configureStore()
reduxStore.dispatch(actions.requestLocations())
reduxStore.dispatch(actions.requestTags())
reduxStore.dispatch(actions.requestYears())
history.push('/')

window.addEventListener('load', () => {
  attachReact()
  initDragAndDrop()
}, false)

function attachReact () {
  const app = React.createElement(App)
  const provider = React.createElement(Provider, { store: reduxStore }, app)
  ReactDOM.render(provider, document.getElementById('app'))
}

function initDragAndDrop () {
  function cleanUp (ev) {
    // Use DataTransfer interface to remove the drag data; Electron/Chromium
    // says the DataTransferItemList items are read-only, so invoking remove()
    // on them results in an error.
    ev.dataTransfer.clearData()
  }

  // At some point it became necessary to add the event handlers to the
  // 'document' rather than an element within the document.
  document.addEventListener('dragover', (ev) => {
    // prevent default to allow drop
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'copy'
  }, false)
  document.addEventListener('dragend', (ev) => {
    // have not seen this event fired, but just in case
    cleanUp(ev)
  }, false)

  document.addEventListener('drop', (ev) => {
    // stop the browser from redirecting to the file
    ev.preventDefault()
    // hack a generator as an iterator onto the transfer object
    ev.dataTransfer[Symbol.iterator] = function * () {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (const item of ev.dataTransfer.items) {
          if (item.kind === 'file') {
            yield item.getAsFile()
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (const file of ev.dataTransfer.files) {
          yield file
        }
      }
    }
    const files = []
    for (const file of ev.dataTransfer) {
      files.push({
        // just the file name
        name: file.name,
        // full path of file
        path: file.path,
        // size in bytes
        size: file.size,
        // mimetype (is null if unrecognized by browser?)
        mimetype: file.type || 'application/octet-stream'
      })
    }
    reduxStore.dispatch(actions.dropFiles(files))
    cleanUp(ev)
    return false
  }, false)
}

ipcRenderer.on('route:options', (event, arg) => {
  if (arg === 'go') {
    history.push('/options')
  } else {
    console.warn(`received ${arg} for route:options event`)
  }
})
