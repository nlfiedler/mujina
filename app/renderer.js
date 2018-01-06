//
// Copyright (c) 2017 Nathan Fiedler
//
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//
const React = require('react')
const ReactDOM = require('react-dom')
const {Provider} = require('react-redux')
const {App} = require('./components/App')
const actions = require('./actions')
const reduxStore = require('./store').configureStore()
const {push} = require('react-router-redux')

reduxStore.dispatch(actions.requestLocations())
reduxStore.dispatch(actions.requestTags())
reduxStore.dispatch(actions.requestYears())
reduxStore.dispatch(push('/'))

window.addEventListener('load', function () {
  attachReact()
  initDragAndDrop()
}, false)

function attachReact () {
  const app = React.createElement(App)
  const provider = React.createElement(Provider, {store: reduxStore}, app)
  ReactDOM.render(provider, document.getElementById('app'))
}

function initDragAndDrop () {
  const drop = document.getElementById('app')

  function cleanUp (ev) {
    // Use DataTransfer interface to remove the drag data; Electron/Chromium
    // says the DataTransferItemList items are read-only, so invoking remove()
    // on them results in an error.
    ev.dataTransfer.clearData()
  }

  drop.addEventListener('dragover', (ev) => {
    // prevent default to allow drop
    ev.preventDefault()
    ev.dataTransfer.dropEffect = 'copy'
  }, false)
  drop.addEventListener('dragend', (ev) => {
    // have not seen this event fired, but just in case
    cleanUp(ev)
  }, false)

  drop.addEventListener('drop', function (ev) {
    // stop the browser from redirecting to the file
    ev.preventDefault()
    // hack a generator as an iterator onto the transfer object
    ev.dataTransfer[Symbol.iterator] = function * () {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let item of ev.dataTransfer.items) {
          if (item.kind === 'file') {
            yield item.getAsFile()
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let file of ev.dataTransfer.files) {
          yield file
        }
      }
    }
    let files = []
    for (let file of ev.dataTransfer) {
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
