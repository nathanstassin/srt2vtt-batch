const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const srt2vtt = require('srt-to-vtt')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools()
  
  mainWindow.loadFile('index.html')
}

ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
})

ipcMain.handle('convert-srt', (event, baseDir) => {
  return new Promise((resolve, reject) => {
    const srtDir = path.join(baseDir, 'SRT')
    const vttDir = path.join(baseDir, 'VTT')

    // Create VTT directory if needed
    if (!fs.existsSync(vttDir)) {
      fs.mkdirSync(vttDir, { recursive: true })
    }

    // Read SRT files
    fs.readdir(srtDir, (err, files) => {
      if (err) return reject('Failed to read SRT directory: ' + err.message)
      
      const srtFiles = files.filter(f => f.toLowerCase().endsWith('.srt'))
      if (srtFiles.length === 0) return reject('No SRT files found')

      let processed = 0
      srtFiles.forEach(file => {
        const inputPath = path.join(srtDir, file)
        const outputName = file.replace(/\.srt$/i, '.vtt')
        const outputPath = path.join(vttDir, outputName)

        const readStream = fs.createReadStream(inputPath)
        const writeStream = fs.createWriteStream(outputPath)

        readStream
          .pipe(srt2vtt())
          .pipe(writeStream)
          .on('finish', () => {
            // Fix VTT header
            fs.readFile(outputPath, 'utf8', (err, data) => {
              if (!err) {
                const fixed = data.replace(/^WEBVTT FILE/, 'WEBVTT')
                fs.writeFile(outputPath, fixed, 'utf8', () => {
                  processed++
                  mainWindow.webContents.send('conversion-progress', {
                    file: file,
                    progress: processed/srtFiles.length
                  })
                  if (processed === srtFiles.length) resolve()
                })
              }
            })
          })
          .on('error', err => reject(err.message))
      })
    })
  })
})

app.whenReady().then(createWindow)