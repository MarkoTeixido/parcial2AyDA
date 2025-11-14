const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { WINDOW_CONFIG, PATHS } = require('./config');
const handleExecuteTP = require('./handlers/executeTP');
const handleDownloadFiles = require('./handlers/downloadFiles');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: WINDOW_CONFIG.width,
        height: WINDOW_CONFIG.height,
        webPreferences: {
            preload: path.join(PATHS.renderer, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(PATHS.renderer, 'index.html'));
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('execute-tp-script', handleExecuteTP);

ipcMain.handle('download-tp-files', async (event, tpFolder) => {
    return handleDownloadFiles(event, tpFolder, mainWindow);
});