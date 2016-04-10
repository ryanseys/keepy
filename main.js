'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 600, height: 275, title: 'Google Keep', show: false })

  // Load Google Keep
  mainWindow.loadURL('https://keep.google.com/')

  // When we have the DOM, hide the stuff we don't want and focus the input field
  mainWindow.webContents.on('dom-ready', function () {
    mainWindow.webContents.insertCSS('.notes-container { padding-top: 0!important; }')
    mainWindow.webContents.executeJavaScript('document.querySelector("#og-nwrapper").style.display = "none";')
    mainWindow.webContents.executeJavaScript('document.querySelector(".notes-container").children[0].children[0].children[6].style.display = "none";')
    mainWindow.webContents.executeJavaScript('document.querySelector(".notes-container").children[1].children[3].style.display = "none";')
    mainWindow.webContents.executeJavaScript('document.querySelector(".notes-container").style.visibility = "visible";')
    mainWindow.webContents.executeJavaScript('document.querySelector("div[contenteditable=\'true\']").click()')
    showWhenReady()
  })

  // Show the window only when it's done loading.
  function showWhenReady () {
    if (mainWindow.webContents.isLoading()) {
      setTimeout(showWhenReady, 100)
    } else {
      mainWindow.show()
    }
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
