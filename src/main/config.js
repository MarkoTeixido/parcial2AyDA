const path = require('path');

const TP_CONFIG = {
    'TP1': {
        script: 'OrdenamientoBurbuja.js',
        files: ['datosDesordenados.txt', 'datosOrdenados.txt']
    },
    'TP2': {
        script: 'FuerzaBruta.js',
        files: ['texto.txt']
    },
    'TP3-A': {
        script: 'SelectionSort.js',
        files: ['datosDesordenados.txt', 'datosOrdenados.txt', 'resultados_selectionSort.txt']
    },
    'TP3-B': {
        script: 'tsp.js',
        files: ['resultados_tsp.txt']
    },
    'TP3-C': {
        script: 'knapsack.js',
        files: ['resultados_knapsack.txt']
    },
    'TP5-A': {
        script: 'genereacionBinario.js',
        files: []
    },
    'TP5-B': {
        scripts: [
            { name: 'BusquedaSecuencialDaOr.js', label: 'Búsqueda Secuencial' },
            { name: 'Merge-Sort.js', label: 'Merge Sort' },
            { name: 'QuickSelect-Hoare.js', label: 'QuickSelect (Hoare)' },
            { name: 'QuickSelect-Lomuto.js', label: 'QuickSelect (Lomuto)' }
        ],
        files: ['Analizar.txt']
    },
    'TP5-C1': {
        scripts: [
            { name: '2-fuerzabruta.js', label: 'Fuerza Bruta' },
            { name: '2-RedYCon.js', label: 'Reducción y Conquista' }
        ],
        files: []
    },
    'TP5-C2': {
        scripts: [
            { name: 'DivideYVencerás.js', label: 'Divide y Vencerás' },
            { name: 'FuerzaBruta.js', label: 'Fuerza Bruta' },
            { name: 'Heuristica.js', label: 'Heurística' }
        ],
        files: []
    },
    'TP5-D1': {
        script: 'Ejercicio4-Tp5-A.js',
        files: []
    },
    'TP5-D2': {
        script: 'Ejercicio4-Tp5-B.js',
        files: []
    },
    'TP5-D3': {
        script: 'Ejercicio4-Tp5-C.js',
        files: []
    },
    'TP6-A': {
        scripts: [
            { name: 'v1_FuerzaBruta.js', label: 'V1 - Fuerza Bruta' },
            { name: 'v2_Optimizada.js', label: 'V2 - Optimizada con Strings' },
            { name: 'v3_kmp.js', label: 'V3 - Algoritmo KMP' },
            { name: 'v4_trie.js', label: 'V4 - Trie (Árbol de Prefijos)' }
        ],
        files: ['resultado_v1_fuerza_bruta_1761239327584.txt', 'resultado_v2_optimizada_1761239463775.txt', 'resultado_v3_kmp_1761239679996.txt', 'resultado_v4_trie_1761239897086.txt']
    },
    'TP6-B': {
        script: 'avl.js',
        files: ['resultado_ejercicio2_avl_1761240274438.txt']
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