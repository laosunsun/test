const { app, BrowserWindow, ipcMain } = require('electron')
// const process = require('process') ;
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const { startBrowser } = require('./tools/index')
const { saveFile, openFile } = require('./tools/file')
const EventEmitter = require('events');
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    // titleBarStyle: "hidden",
    // frame: false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      //webSecurity:false,
      enableRemoteModule: true,
    }
  })

  const localFile = url.format({
    protocol: 'file',
    slashes: true,
    pathname: path.join(__dirname, 'dist', 'index.html')
  })
  if (isDev) {
    mainWindow.loadURL("http://localhost:8080")
  } else {
    mainWindow.loadURL(localFile)
  }

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const emitter = new EventEmitter()
emitter.setMaxListeners(100)

ipcMain.on('startBrowser', (event, arg) => {

  // console.log(event, arg);
  // const configFile = path.join(path.dirname(__dirname), 'extraResources','chrome.exe');
  // event.reply("testChanel", configFile)
console.log('@@@', arg)
  startBrowser(event, arg)


})


ipcMain.on('stopBrowser', (event, arg) => {
  //ESRCH 可能进程id找不到
  // console.log(arg.pid,'@@@@@')
  

  try {
    process.kill(parseInt(arg.pid), 'SIGTERM')
  } catch(e) {

  }

})


ipcMain.on('saveProfile', (event, arg) => {

  // console.log(event, arg);
  // const configFile = path.join(path.dirname(__dirname), 'extraResources','chrome.exe');
  // event.reply("testChanel", configFile)

  // startBrowser(event, arg)
  // console.log(event, arg)
  saveFile(arg.name.path, arg.path, arg.config)


})

ipcMain.on('openProfile', (event, arg) => {


  openFile(event)

})