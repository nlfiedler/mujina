//
// Copyright (c) 2017 Nathan Fiedler
//
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const Store = require('electron-store')
const configStore = new Store()
const windowStateKeeper = require('electron-window-state')
const request = require('request')
const actions = require('./actions')
const reduxStore = require('./store').configureStore()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindows = new Map()

const createWindow = () => {
  // Create the browser window.
  let windowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })
  let win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 400,
    minHeight: 300
  })
  windowState.manage(win)
  let winId = win.id
  mainWindows.set(winId, win)

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  win.on('closed', () => {
    mainWindows.delete(winId)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindows.size === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('tags:fetch', (event) => {
  const unsubscribe = reduxStore.subscribe(() => {
    const state = reduxStore.getState().tags
    if (!state.isPending) {
      if (state.error === null) {
        event.sender.send('tags:result', state.items)
      } else {
        event.sender.send('tags:error', state.error.toString())
      }
      unsubscribe()
    }
  })
  reduxStore.dispatch(actions.requestTags())
})

ipcMain.on('files:upload', (event, files) => {
  for (let file of files) {
    let formData = {
      asset: {
        value: fs.createReadStream(file.path),
        options: {
          filename: file.name,
          contentType: file.type
        }
      }
    }
    request.post({
      url: url.format({
        protocol: 'http:',
        hostname: configStore.get('backend.host', 'localhost'),
        port: configStore.get('backend.port', 3000),
        pathname: '/api/assets'
      }),
      formData
    }, (err, response, body) => {
      // TODO: should map the results to the original file,
      //       otherwise the last result overwrites everything else
      if (err) {
        event.sender.send('files:error', err.toString())
      } else {
        event.sender.send('files:success', body)
      }
    })
  }
})
