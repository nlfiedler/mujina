//
// Copyright (c) 2017 Nathan Fiedler
//
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

exports.fetchTags = () => {
  ipcRenderer.send('tags:fetch')
}
ipcRenderer.on('tags:result', (event, tags) => {
  const div = document.querySelector('div#tags')
  div.innerHTML = JSON.stringify(tags)
})
ipcRenderer.on('tags:error', (event, err) => {
  const div = document.querySelector('div#tags')
  div.innerHTML = err
})

exports.dragover_handler = (ev) => {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'copy'
}
exports.drop_handler = (ev) => {
  ev.preventDefault()
  let data = ev.dataTransfer.getData('text')
  console.log(data)
}

window.addEventListener('load', function () {
  let drop = document.getElementById('drop')

  function cancel (e) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    return false
  }

  // Tells the browser that we *can* drop on this target
  drop.addEventListener('dragover', cancel, false)
  drop.addEventListener('dragenter', cancel, false)

  // Handle the actual drop event.
  drop.addEventListener('drop', function (e) {
    // stops the browser from redirecting off to the image
    e.preventDefault()
    let files = []
    for (let file of e.dataTransfer.files) {
      // the file objects are not serializable, convert to objects...
      files.push({
        name: file.name,  // just the file name
        path: file.path,  // full path of file
        type: file.type,  // mimetype
        size: file.size   // size in bytes
      })
    }
    ipcRenderer.send('files:upload', files)
    return false
  }, false)
}, false)

ipcRenderer.on('files:success', (event, body) => {
  const div = document.querySelector('div#status')
  div.innerHTML = body
})
ipcRenderer.on('files:error', (event, err) => {
  const div = document.querySelector('div#status')
  div.innerHTML = err
})
