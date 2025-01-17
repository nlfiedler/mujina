//
// Copyright (c) 2019 Nathan Fiedler
//
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const windowStateKeeper = require('electron-window-state')
const menu = require('./menu')

// Detect if we are running in development mode or not.
const isDevMode = process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const mainWindows = new Map()

const createWindow = () => {
  // Create the browser window.
  const windowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })
  const win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 400,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })
  windowState.manage(win)
  const winId = win.id
  mainWindows.set(winId, win)

  if (isDevMode) {
    win.webContents.openDevTools()
  }

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
app.on('ready', function () {
  createWindow()
  menu.setMainMenu()
})

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
