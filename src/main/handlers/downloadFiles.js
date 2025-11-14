const { dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { TP_CONFIG, PATHS } = require('../config');

function createZip(filePaths, outputPath) {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(outputPath);

        output.on('close', () => {
            resolve(`✅ Archivos de (${archive.pointer()} bytes) guardados exitosamente en:\n${outputPath}`);
        });

        archive.on('error', (err) => {
            reject(new Error(`Error al crear el archivo ZIP: ${err.message}`));
        });

        archive.pipe(output);

        let filesAdded = 0;
        filePaths.forEach(({ fullPath, fileName }) => {
            if (fs.existsSync(fullPath)) {
                archive.file(fullPath, { name: fileName });
                filesAdded++;
            }
        });

        if (filesAdded === 0) {
            reject(new Error('No se pudo encontrar ninguno de los archivos .txt. Ejecute el TP primero.'));
            return;
        }

        archive.finalize();
    });
}

async function handleDownloadFiles(event, tpFolder, mainWindow) {
    const tpConfig = TP_CONFIG[tpFolder];
    
    if (!tpConfig) {
        throw new Error(`No se encontró configuración para ${tpFolder}.`);
    }

    const filesToArchive = tpConfig.files;

    // Verificar si hay archivos para descargar
    if (!filesToArchive || filesToArchive.length === 0 || (filesToArchive.length === 1 && filesToArchive[0] === '')) {
        throw new Error(`El ${tpFolder} no genera archivos de salida para descargar.`);
    }

    const zipFileName = `${tpFolder}_Archivos.zip`;
    const { canceled, filePath: savePath } = await dialog.showSaveDialog(mainWindow, {
        title: `Guardar ${zipFileName}`,
        defaultPath: zipFileName,
        filters: [
            { name: 'Archivos ZIP', extensions: ['zip'] },
            { name: 'Todos los Archivos', extensions: ['*'] }
        ]
    });

    if (canceled || !savePath) {
        return 'Descarga cancelada';
    }

    const filePaths = filesToArchive
        .filter(fileName => fileName !== '') // Filtrar strings vacíos
        .map(fileName => ({
            fullPath: path.join(PATHS.practicos, tpFolder, fileName),
            fileName
        }));

    return createZip(filePaths, savePath);
}

module.exports = handleDownloadFiles;