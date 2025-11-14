const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const { TP_CONFIG } = require('../config');

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
        return;
      }
      if (stderr) {
        resolve(stdout + '\n' + stderr);
        return;
      }
      resolve(stdout);
    });
  });
}

function getPracticosPath() {
  if (app.isPackaged) {
    // Producción (empaquetado)
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'practicos');
  } else {
    // Desarrollo (npm start)
    return path.join(__dirname, '../../..', 'practicos');
  }
}

async function handleExecuteTP(event, tpFolder, scriptName) {
  const tpData = TP_CONFIG[tpFolder];
  if (!tpData) throw new Error(`No se encontró configuración para ${tpFolder}`);

  const finalScriptName = scriptName || tpData.script;
  if (!finalScriptName) throw new Error(`No hay script definido para ${tpFolder}`);

  const basePath = getPracticosPath();
  const scriptPath = path.join(basePath, tpFolder, finalScriptName);

  console.log('📂 Ejecutando:', scriptPath);

  if (!fs.existsSync(scriptPath)) {
    throw new Error(`El script no existe: ${scriptPath}`);
  }

  return executeCommand(`node "${scriptPath}"`);
}

module.exports = handleExecuteTP;
