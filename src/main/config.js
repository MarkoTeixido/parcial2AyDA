const path = require('path');

const TP_CONFIG = {
    'ejercicio1': {
        script: 'sudoku.js',
        files: []
    },
    'ejercicio2': {
        script: 'huffman.js',
        files: ['resultado_huffman_*.txt']
    },
    'ejercicio3': {
        script: 'mst_antenas.js',
        files: ['resultado_mst_antenas_*.txt']
    },
};

const WINDOW_CONFIG = {
    width: 1000,
    height: 800
};

const PATHS = {
    practicos: path.join(__dirname, '..', '..', 'practicos'),
    renderer: path.join(__dirname, '..', 'renderer')
};

module.exports = {
    TP_CONFIG,
    WINDOW_CONFIG,
    PATHS
};