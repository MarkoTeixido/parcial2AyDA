const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    executeTPScript: (tpFolder, scriptName) => ipcRenderer.invoke('execute-tp-script', tpFolder, scriptName),
    downloadTPFiles: (tpFolder) => ipcRenderer.invoke('download-tp-files', tpFolder)
});