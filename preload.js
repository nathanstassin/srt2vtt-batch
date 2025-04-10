const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  convert: (path) => ipcRenderer.invoke('convert-srt', path),
  onProgress: (callback) => {
    ipcRenderer.on('conversion-progress', callback)
  }
})