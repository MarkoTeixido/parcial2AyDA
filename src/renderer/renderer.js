// Configuración de los TPs
const TPS = [
    {
        id: 'ejercicio1',
        title: 'Ejercicio 1: Solucionador de Sudoku (35 puntos)',
        description: 'Resuelve instancias válidas de Sudoku utilizando técnica de resolución exacta (Backtracking).',
        color: 'green'
    },
    {
        id: 'ejercicio2',
        title: 'Ejercicio 2: Compresión de Datos - Codificación de Huffman (35 puntos)',
        description: 'Comprime texto usando el esquema de codificación prefijo óptimo de Huffman, analizando frecuencias y reducción de bits.',
        color: 'blue'
    },
    {
        id: 'ejercicio3',
        title: 'Ejercicio 3: Red de Antenas - Árbol de Expansión Mínima (30 puntos)',
        description: 'Diseña una red de comunicaciones que conecte todas las antenas minimizando la longitud total de cable usando el algoritmo de Prim (Greedy).',
        color: 'gray'
    },

];

// SVG del botón play
const PLAY_ICON = `
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3.868v16.264A1 1 0 0 0 6.546 21.3L20.18 13.9a1 1 0 0 0 0-1.8L6.546 2.7A1 1 0 0 0 5 3.868z" fill="currentColor"/>
    </svg>
`;

// SVG del botón download
const DOWNLOAD_ICON = `
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
`;

// Función para obtener la configuración desde el backend
async function getTPConfig(tpId) {
    // Esta función podría llamar al backend para obtener la config
    // Por ahora, asumimos que la config está sincronizada
    return null;
}

// Función para crear botones de ejecución (simple o múltiple)
function createExecutionButtons(tp) {
    if (tp.multipleScripts) {
        // Creamos un contenedor para múltiples botones
        return `
            <div class="flex flex-col gap-2 w-full">
                <p class="text-xs text-slate-600 font-medium">Selecciona el algoritmo a ejecutar:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="scripts-${tp.id}">
                    <!-- Los botones se cargarán dinámicamente -->
                </div>
            </div>
        `;
    } else {
        // Botón único tradicional (estilo original)
        return `
            <button data-tp="${tp.id}" class="execute-tp-btn inline-flex items-center gap-3 bg-${tp.color}-600 hover:bg-${tp.color}-700 text-white px-4 py-2 rounded-md shadow-sm transition">
                ${PLAY_ICON}
                Ejecutar ${tp.id}
            </button>
        `;
    }
}

// Función para crear el HTML de un TP
function createTPSection(tp) {
    const section = document.createElement('section');
    section.className = 'tp-section mb-6 p-4 rounded-lg border border-gray-200 bg-gray-50';
    
    section.innerHTML = `
        <h2 class="text-xl font-medium text-slate-700 mb-2">${tp.title}</h2>
        <p class="text-sm text-slate-600 mb-4">${tp.description}</p>
        
        <div class="flex items-center gap-4 flex-wrap">
            ${createExecutionButtons(tp)}
            
            <button data-tp="${tp.id}" class="download-all-tp-btn inline-flex items-center gap-3 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm transition border border-gray-300">
                ${DOWNLOAD_ICON}
                Descargar Archivos (.zip)
            </button>
        </div>
        
        <h3 class="mt-4 text-sm font-medium text-slate-700">Salida:</h3>
        <pre id="output-${tp.id}" class="code-output mt-2 bg-gray-100 border border-gray-200 rounded-md p-3 text-sm font-mono text-slate-800 max-h-60 overflow-y-auto">Esperando ejecución...</pre>
    `;
    
    return section;
}

// Función para cargar botones de scripts múltiples
async function loadMultipleScriptButtons(tp) {
    const container = document.getElementById(`scripts-${tp.id}`);
    if (!container) return;

    // Configuración de scripts por TP (esto debería venir del backend idealmente)
    const scriptsConfig = {
        'TP5-B': [
            { name: 'BusquedaSecuencialDaOr.js', label: 'Búsqueda Secuencial' },
            { name: 'Merge-Sort.js', label: 'Merge Sort' },
            { name: 'QuickSelect-Hoare.js', label: 'QuickSelect (Hoare)' },
            { name: 'QuickSelect-Lomuto.js', label: 'QuickSelect (Lomuto)' }
        ],
        'TP5-C1': [
            { name: '2-fuerzabruta.js', label: 'Fuerza Bruta' },
            { name: '2-RedYCon.js', label: 'Reducción y Conquista' }
        ],
        'TP5-C2': [
            { name: 'DivideYVencerás.js', label: 'Divide y Vencerás' },
            { name: 'FuerzaBruta.js', label: 'Fuerza Bruta' },
            { name: 'Heuristica.js', label: 'Heurística' }
        ],
        'TP6-A':[
            { name: 'v1_FuerzaBruta.js', label: 'V1 - Fuerza Bruta' },
            { name: 'v2_Optimizada.js', label: 'V2 - Optimizada con Strings' },
            { name: 'v3_kmp.js', label: 'V3 - Algoritmo KMP' },
            { name: 'v4_trie.js', label: 'V4 - Trie (Árbol de Prefijos)' }
        ]
    };

    const scripts = scriptsConfig[tp.id];
    if (!scripts) return;

    scripts.forEach(script => {
        const button = document.createElement('button');
        button.className = `execute-tp-btn inline-flex items-center gap-2 bg-${tp.color}-600 hover:bg-${tp.color}-700 text-white px-3 py-2 rounded-md shadow-sm transition text-sm`;
        button.setAttribute('data-tp', tp.id);
        button.setAttribute('data-script', script.name);
        button.innerHTML = `
            ${PLAY_ICON}
            ${script.label}
        `;
        container.appendChild(button);
    });
}

// Función para renderizar todos los TPs
async function renderTPs() {
    const container = document.getElementById('tp-container');
    
    for (const tp of TPS) {
        const section = createTPSection(tp);
        container.appendChild(section);
        
        // Si tiene múltiples scripts, cargar los botones
        if (tp.multipleScripts) {
            await loadMultipleScriptButtons(tp);
        }
    }
}

// Manejador de ejecución
async function handleExecution(tpFolder, scriptName) {
    const outputElement = document.getElementById(`output-${tpFolder}`);
    outputElement.textContent = `Ejecutando ${scriptName || tpFolder}... por favor, espera.`;

    try {
        const result = await window.electronAPI.executeTPScript(tpFolder, scriptName);
        outputElement.textContent = result;
    } catch (error) {
        outputElement.textContent = `Error al ejecutar ${tpFolder}: \n${error}`;
        console.error(`Error al ejecutar ${tpFolder}:`, error);
    }
}

// Manejador de descarga
async function handleDownload(tpFolder) {
    const outputElement = document.getElementById(`output-${tpFolder}`);
    outputElement.textContent = `Preparando archivos de ${tpFolder} para descarga...`;

    try {
        const message = await window.electronAPI.downloadTPFiles(tpFolder);
        outputElement.textContent = message;
    } catch (error) {
        outputElement.textContent = `❌ Error de descarga: ${error.message}`;
        console.error('Error de descarga:', error);
    }
}

// Función para agregar event listeners
function attachEventListeners() {
    // Usamos delegación de eventos para manejar botones dinámicos
    document.getElementById('tp-container').addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('execute-tp-btn')) {
            const tpFolder = button.getAttribute('data-tp');
            const scriptName = button.getAttribute('data-script');
            
            if (tpFolder) {
                handleExecution(tpFolder, scriptName);
            }
        } else if (button.classList.contains('download-all-tp-btn')) {
            const tpFolder = button.getAttribute('data-tp');
            
            if (tpFolder) {
                handleDownload(tpFolder);
            }
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await renderTPs();
    attachEventListeners();
});