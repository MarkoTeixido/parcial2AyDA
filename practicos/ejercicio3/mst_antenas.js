// ===================================================================
// EJERCICIO 3: DISEÑO DE RED DE ANTENAS - ÁRBOL DE EXPANSIÓN MÍNIMA (30 PUNTOS)
// Técnica: Algoritmos Voraces (Greedy) - Algoritmo de Prim
// ===================================================================

const fs = require('fs');
const path = require('path');

// ===================================================================
// DEFINICIÓN DEL GRAFO (Red de Antenas)
// ===================================================================

const grafo = {
    'A': [
        { destino: 'J', peso: 12 },
        { destino: 'I', peso: 6 },
        { destino: 'H', peso: 10 },
        { destino: 'K', peso: 3 },
        { destino: 'B', peso: 8 },
        { destino: 'G', peso: 9 }
    ],
    'B': [
        { destino: 'K', peso: 7 },
        { destino: 'A', peso: 8 },
        { destino: 'C', peso: 10 },
        { destino: 'E', peso: 2 }
    ],
    'C': [
        { destino: 'K', peso: 5 },
        { destino: 'B', peso: 10 },
        { destino: 'D', peso: 9 }
    ],
    'D': [
        { destino: 'C', peso: 9 },
        { destino: 'E', peso: 13 },
        { destino: 'F', peso: 12 }
    ],
    'E': [
        { destino: 'B', peso: 2 },
        { destino: 'G', peso: 6 },
        { destino: 'D', peso: 13 },
        { destino: 'F', peso: 10 }
    ],
    'F': [
        { destino: 'E', peso: 10 },
        { destino: 'D', peso: 12 },
        { destino: 'G', peso: 8 }
    ],
    'G': [
        { destino: 'A', peso: 9 },
        { destino: 'E', peso: 6 },
        { destino: 'H', peso: 7 },
        { destino: 'F', peso: 8 }
    ],
    'H': [
        { destino: 'I', peso: 3 },
        { destino: 'A', peso: 10 },
        { destino: 'G', peso: 7 }
    ],
    'I': [
        { destino: 'J', peso: 10 },
        { destino: 'H', peso: 3 },
        { destino: 'A', peso: 6 }
    ],
    'J': [
        { destino: 'I', peso: 10 },
        { destino: 'K', peso: 8 },
        { destino: 'A', peso: 12 }
    ],
    'K': [
        { destino: 'J', peso: 8 },
        { destino: 'A', peso: 3 },
        { destino: 'C', peso: 5 },
        { destino: 'B', peso: 7 }
    ]
};

const nodoInicial = 'B';

// ===================================================================
// CLASE PARA REPRESENTAR ARISTAS
// ===================================================================

class Arista {
    constructor(origen, destino, peso) {
        this.origen = origen;
        this.destino = destino;
        this.peso = peso;
    }

    toString() {
        return `${this.origen} -- ${this.destino} (${this.peso} km)`;
    }
}

// ===================================================================
// ALGORITMO DE PRIM (GREEDY) - Árbol de Expansión Mínima
// ===================================================================

function algoritmoDePrim(grafo, inicio) {
    const visitados = new Set();
    const aristasSeleccionadas = [];
    const pasos = [];
    let distanciaTotal = 0;

    visitados.add(inicio);
    pasos.push({
        paso: 0,
        accion: `Iniciando desde el nodo ${inicio}`,
        visitados: Array.from(visitados),
        aristaSeleccionada: null,
        distanciaAcumulada: 0
    });

    let paso = 1;

    while (visitados.size < Object.keys(grafo).length) {
        let aristaMinima = null;
        let pesoMinimo = Infinity;

        for (const nodo of visitados) {
            const vecinos = grafo[nodo] || [];

            for (const vecino of vecinos) {
                if (!visitados.has(vecino.destino)) {
                    if (vecino.peso < pesoMinimo) {
                        pesoMinimo = vecino.peso;
                        aristaMinima = new Arista(nodo, vecino.destino, vecino.peso);
                    }
                }
            }
        }

        if (aristaMinima) {
            aristasSeleccionadas.push(aristaMinima);
            visitados.add(aristaMinima.destino);
            distanciaTotal += aristaMinima.peso;

            pasos.push({
                paso: paso++,
                accion: `Seleccionar arista de menor peso disponible`,
                aristaSeleccionada: aristaMinima,
                visitados: Array.from(visitados),
                distanciaAcumulada: distanciaTotal
            });
        } else {
            break;
        }
    }

    return {
        aristasSeleccionadas,
        distanciaTotal,
        pasos,
        nodosVisitados: visitados
    };
}

// ===================================================================
// FUNCIONES DE VISUALIZACIÓN
// ===================================================================

function mostrarModeladoProblema() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 a) MODELADO DEL PROBLEMA COMO GRAFO');
    console.log('='.repeat(70));
    console.log('🔹 Tipo de grafo: No dirigido, ponderado, conexo');
    console.log('🔹 Nodos (antenas): {A, B, C, D, E, F, G, H, I, J, K}');
    console.log('🔹 Aristas (cables posibles): representan conexiones con distancias\n');
    console.log('📍 Lista de Adyacencia del Grafo:\n');

    for (const [nodo, vecinos] of Object.entries(grafo).sort()) {
        const conexiones = vecinos.map(v => `${v.destino}(${v.peso}km)`).join(', ');
        console.log(`   ${nodo} → [${conexiones}]`);
    }

    console.log('\n🎯 Objetivo: Conectar todas las antenas minimizando la longitud total de cable');
    console.log('='.repeat(70) + '\n');
}

function mostrarEstrategia() {
    console.log('\n' + '='.repeat(70));
    console.log('🧠 b) ALGORITMO PROPUESTO: Algoritmo de Prim');
    console.log('='.repeat(70));
    console.log('📖 Descripción:');
    console.log('   El algoritmo de Prim construye un Árbol de Expansión Mínima (MST)');
    console.log('   seleccionando iterativamente la arista de menor peso que conecte');
    console.log('   un nodo ya visitado con uno no visitado.\n');
    
    console.log('🔹 c) ESTRATEGIA DE DISEÑO: Algoritmos Voraces (Greedy)');
    console.log('   └─ En cada paso, toma la decisión localmente óptima');
    console.log('   └─ Selecciona siempre la arista de menor peso disponible');
    console.log('   └─ Garantiza solución globalmente óptima para MST\n');
    
    console.log('📐 Complejidad Temporal: O(E log V) con heap binario');
    console.log('   └─ E = número de aristas, V = número de vértices');
    console.log('='.repeat(70) + '\n');
}

function mostrarEjecucionPasoAPaso(resultado) {
    console.log('\n' + '='.repeat(70));
    console.log('⚙️  d) EJECUCIÓN PASO A PASO DEL ALGORITMO DE PRIM');
    console.log('='.repeat(70));
    console.log(`🚀 Comenzando desde la antena: ${nodoInicial}\n`);

    for (const paso of resultado.pasos) {
        console.log(`📍 Paso ${paso.paso}:`);
        console.log(`   ${paso.accion}`);
        
        if (paso.aristaSeleccionada) {
            console.log(`   ✅ Arista seleccionada: ${paso.aristaSeleccionada.toString()}`);
        }
        
        console.log(`   🔵 Nodos visitados: {${paso.visitados.join(', ')}}`);
        console.log(`   📏 Distancia acumulada: ${paso.distanciaAcumulada} km`);
        console.log('');
    }

    console.log('='.repeat(70) + '\n');
}

function mostrarResultadoFinal(resultado) {
    console.log('\n' + '='.repeat(70));
    console.log('🎯 RESULTADO FINAL: ÁRBOL DE EXPANSIÓN MÍNIMA (MST)');
    console.log('='.repeat(70));
    console.log('\n📋 Lista de Aristas Finales que forman la Red Resultante:\n');

    resultado.aristasSeleccionadas.forEach((arista, index) => {
        console.log(`   ${index + 1}. ${arista.toString()}`);
    });

    console.log('\n' + '-'.repeat(70));
    console.log(`📏 DISTANCIA TOTAL DE CABLE NECESARIO: ${resultado.distanciaTotal} km`);
    console.log('-'.repeat(70));
    console.log(`\n✅ Todas las antenas están conectadas con el mínimo cable posible`);
    console.log(`🔢 Total de aristas utilizadas: ${resultado.aristasSeleccionadas.length}`);
    console.log(`🔢 Total de nodos conectados: ${resultado.nodosVisitados.size}`);
    console.log('='.repeat(70) + '\n');
}

function guardarResultados(resultado) {
    const timestamp = Date.now();
    const nombreArchivo = `resultado_mst_antenas_${timestamp}.txt`;
    const rutaArchivo = path.join(__dirname, nombreArchivo);

    let contenido = '';

    contenido += '='.repeat(70) + '\n';
    contenido += 'EJERCICIO 3: DISEÑO DE RED DE ANTENAS - MST (30 PUNTOS)\n';
    contenido += 'Algoritmo: Prim (Estrategia Greedy/Voraz)\n';
    contenido += '='.repeat(70) + '\n\n';

    contenido += 'MODELADO DEL PROBLEMA:\n';
    contenido += 'Nodos (Antenas): {A, B, C, D, E, F, G, H, I, J, K}\n';
    contenido += `Nodo inicial: ${nodoInicial}\n\n`;

    contenido += 'LISTA DE ADYACENCIA:\n';
    for (const [nodo, vecinos] of Object.entries(grafo).sort()) {
        const conexiones = vecinos.map(v => `${v.destino}(${v.peso}km)`).join(', ');
        contenido += `${nodo} → [${conexiones}]\n`;
    }

    contenido += '\n' + '='.repeat(70) + '\n';
    contenido += 'EJECUCIÓN PASO A PASO:\n';
    contenido += '='.repeat(70) + '\n\n';

    for (const paso of resultado.pasos) {
        contenido += `Paso ${paso.paso}: ${paso.accion}\n`;
        if (paso.aristaSeleccionada) {
            contenido += `  Arista: ${paso.aristaSeleccionada.toString()}\n`;
        }
        contenido += `  Visitados: {${paso.visitados.join(', ')}}\n`;
        contenido += `  Distancia acumulada: ${paso.distanciaAcumulada} km\n\n`;
    }

    contenido += '='.repeat(70) + '\n';
    contenido += 'RESULTADO FINAL:\n';
    contenido += '='.repeat(70) + '\n\n';

    contenido += 'Aristas del Árbol de Expansión Mínima:\n';
    resultado.aristasSeleccionadas.forEach((arista, index) => {
        contenido += `${index + 1}. ${arista.toString()}\n`;
    });

    contenido += `\nDISTANCIA TOTAL: ${resultado.distanciaTotal} km\n`;
    contenido += `Total de aristas: ${resultado.aristasSeleccionadas.length}\n`;
    contenido += `Total de nodos conectados: ${resultado.nodosVisitados.size}\n`;

    fs.writeFileSync(rutaArchivo, contenido, 'utf8');
    console.log(`💾 Resultados guardados en: ${nombreArchivo}\n`);
}

// ===================================================================
// GENERACIÓN DE VISUALIZACIÓN HTML INTERACTIVA
// ===================================================================

function generarVisualizacionHTML(resultado) {
    const timestamp = Date.now();
    const nombreArchivo = `grafo_mst_${timestamp}.html`;
    const rutaArchivo = path.join(__dirname, nombreArchivo);

    // Crear lista de todas las aristas del grafo original
    const todasLasAristas = [];
    const aristasYaProcesadas = new Set();

    for (const [nodo, vecinos] of Object.entries(grafo)) {
        for (const vecino of vecinos) {
            const aristaId = [nodo, vecino.destino].sort().join('-');
            if (!aristasYaProcesadas.has(aristaId)) {
                todasLasAristas.push({
                    from: nodo,
                    to: vecino.destino,
                    label: `${vecino.peso} km`,
                    peso: vecino.peso
                });
                aristasYaProcesadas.add(aristaId);
            }
        }
    }

    // Crear set de aristas del MST para identificarlas
    const aristasMST = new Set();
    resultado.aristasSeleccionadas.forEach(arista => {
        const aristaId = [arista.origen, arista.destino].sort().join('-');
        aristasMST.add(aristaId);
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualización MST - Red de Antenas</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 18px;
        }
        #mynetwork {
            width: 100%;
            height: 600px;
            border: 2px solid #ddd;
            border-radius: 10px;
            background: #fafafa;
        }
        .info-panel {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .info-box h3 {
            margin-top: 0;
            color: #667eea;
        }
        .mst-list {
            list-style: none;
            padding: 0;
        }
        .mst-list li {
            padding: 8px;
            margin: 5px 0;
            background: white;
            border-radius: 5px;
            border-left: 3px solid #28a745;
        }
        .legend {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .legend-line {
            width: 50px;
            height: 4px;
            border-radius: 2px;
        }
        .legend-line.mst {
            background: #28a745;
        }
        .legend-line.original {
            background: #cccccc;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .stat-item {
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
        }
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗼 Red de Antenas - Árbol de Expansión Mínima</h1>
        <p class="subtitle">Algoritmo de Prim (Estrategia Greedy)</p>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-value">${resultado.distanciaTotal}</div>
                <div class="stat-label">km de cable total</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${resultado.aristasSeleccionadas.length}</div>
                <div class="stat-label">aristas utilizadas</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${resultado.nodosVisitados.size}</div>
                <div class="stat-label">nodos conectados</div>
            </div>
        </div>

        <div class="legend">
            <div class="legend-item">
                <div class="legend-line mst"></div>
                <span><strong>Aristas del MST</strong> (cables a instalar)</span>
            </div>
            <div class="legend-item">
                <div class="legend-line original"></div>
                <span>Aristas no utilizadas</span>
            </div>
        </div>

        <div id="mynetwork"></div>

        <div class="info-panel">
            <div class="info-box">
                <h3>📋 Aristas del MST (Orden de Selección)</h3>
                <ul class="mst-list">
                    ${resultado.aristasSeleccionadas.map((arista, index) => 
                        `<li>${index + 1}. ${arista.origen} ← ${arista.peso} km → ${arista.destino}</li>`
                    ).join('')}
                </ul>
            </div>
            <div class="info-box">
                <h3>ℹ️ Información del Algoritmo</h3>
                <p><strong>Algoritmo:</strong> Prim (Greedy)</p>
                <p><strong>Nodo inicial:</strong> ${nodoInicial}</p>
                <p><strong>Total de nodos:</strong> ${Object.keys(grafo).length}</p>
                <p><strong>Total de aristas originales:</strong> ${todasLasAristas.length}</p>
                <p><strong>Complejidad:</strong> O(E log V)</p>
                <p><strong>Garantía:</strong> Solución óptima global</p>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        // Crear nodos
        const nodes = new vis.DataSet([
            ${Object.keys(grafo).map(nodo => `
            { 
                id: '${nodo}', 
                label: '${nodo}',
                color: {
                    background: '${nodo === nodoInicial ? '#FF6B6B' : '#4ECDC4'}',
                    border: '${nodo === nodoInicial ? '#C92A2A' : '#0CA789'}',
                    highlight: {
                        background: '#FFD93D',
                        border: '#F57F17'
                    }
                },
                font: { 
                    size: 20, 
                    color: 'white',
                    bold: true
                },
                size: ${nodo === nodoInicial ? 35 : 25}
            }`).join(',')}
        ]);

        // Crear aristas
        const edges = new vis.DataSet([
            ${todasLasAristas.map(arista => {
                const aristaId = [arista.from, arista.to].sort().join('-');
                const esMST = aristasMST.has(aristaId);
                return `{
                    from: '${arista.from}',
                    to: '${arista.to}',
                    label: '${arista.label}',
                    color: {
                        color: '${esMST ? '#28a745' : '#cccccc'}',
                        highlight: '#FFD93D'
                    },
                    width: ${esMST ? 5 : 2},
                    font: { 
                        size: 14, 
                        background: 'white',
                        strokeWidth: 0,
                        color: '${esMST ? '#28a745' : '#666'}'
                    },
                    smooth: { type: 'curvedCW', roundness: 0.1 }
                }`;
            }).join(',')}
        ]);

        // Crear el grafo
        const container = document.getElementById('mynetwork');
        const data = { nodes: nodes, edges: edges };
        const options = {
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based',
                stabilization: {
                    iterations: 150
                },
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    springLength: 150,
                    springConstant: 0.05
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 100,
                dragNodes: true,
                dragView: true,
                zoomView: true
            }
        };

        const network = new vis.Network(container, data, options);

        // Estabilizar y ajustar vista
        network.once('stabilizationIterationsDone', function() {
            network.fit({
                animation: {
                    duration: 1000,
                    easingFunction: 'easeInOutQuad'
                }
            });
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(rutaArchivo, htmlContent, 'utf8');
    console.log(`🎨 Visualización HTML generada: ${nombreArchivo}`);
    console.log(`   Abre el archivo en tu navegador para ver el grafo interactivo.\n`);
}

// ===================================================================
// FUNCIÓN PRINCIPAL
// ===================================================================

function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║   EJERCICIO 3: DISEÑO DE RED DE ANTENAS - MST (30 PUNTOS)         ║');
    console.log('║   Técnica: Algoritmos Voraces (Greedy) - Algoritmo de Prim        ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');

    mostrarModeladoProblema();
    mostrarEstrategia();

    console.log('🔄 Ejecutando Algoritmo de Prim desde el nodo B...\n');
    const resultado = algoritmoDePrim(grafo, nodoInicial);

    mostrarEjecucionPasoAPaso(resultado);
    mostrarResultadoFinal(resultado);
    guardarResultados(resultado);

    // GENERAR VISUALIZACIÓN GRÁFICA
    generarVisualizacionHTML(resultado);

    console.log('='.repeat(70));
    console.log('✅ FIN DE LA EJECUCIÓN');
    console.log('='.repeat(70) + '\n');
}

main();