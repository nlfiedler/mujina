//
// Copyright (c) 2017 Nathan Fiedler
//
const {app, BrowserWindow, ipcMain, net} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const Store = require('electron-store')
const store = new Store()
const windowStateKeeper = require('electron-window-state')
const request = require('request')

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
  mainWindows.set(win.id, win)

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  win.on('closed', () => {
    mainWindows.delete(win.id)
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
  const request = net.request({
    method: 'GET',
    hostname: store.get('backend.host', 'localhost'),
    port: store.get('backend.port', 4000),
    path: '/api/tags'
  })
  request.on('response', (response) => {
    let rawData = ''
    response.on('data', (chunk) => {
      rawData += chunk
    })
    response.on('end', () => {
      const parsedData = JSON.parse(rawData)
      event.sender.send('tags:result', parsedData)
    })
  })
  request.on('error', (err) => {
    // Error object does not serialize properly?
    event.sender.send('tags:error', err.toString())
  })
  request.end()
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
        hostname: store.get('backend.host', 'localhost'),
        port: store.get('backend.port', 4000),
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
