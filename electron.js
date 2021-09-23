const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 820,
    minWidth: 1250,
    minHeight: 800,
    icon: __dirname + '/src/images/pharmacie_icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(
      isDev ? 'http:localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    )

    win.setMenuBarVisibility(false)
    win.removeMenu()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
