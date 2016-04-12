/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    icon: 'icon.png',
    width: 600,
    height: 275,
    title: 'Keepy',
    minWidth: 360,
    minHeight: 225,
    show: false
  })

  // Load Google Keep
  mainWindow.loadURL('https://keep.google.com/')

  // When we have the DOM, hide the stuff we don't want and focus the input field
  mainWindow.webContents.on('dom-ready', function () {
    if (mainWindow.webContents.getURL().indexOf('https://accounts.google.com/') === 0) {
      // Not signed in yet.
      mainWindow.setSize(600, 850)
    } else {
      mainWindow.setSize(600, 275)
    }
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
      mainWindow.setTitle('Keepy')
    }
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null
  })

  var template = [
    {
      label: 'Application',
      submenu: [
        { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Quit',
          accelerator: 'Command+Q',
          click: function () { app.quit() }
        }
      ]
    }, {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

// Electron is ready to create browser windows.
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
