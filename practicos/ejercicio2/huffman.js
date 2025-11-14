// ===================================================================
// EJERCICIO 2: COMPRESIÓN DE DATOS - CODIFICACIÓN DE HUFFMAN (35 PUNTOS)
// Técnica: Transformar y Conquistar (Árboles de Codificación)
// ===================================================================

const fs = require('fs');
const path = require('path');

// Texto a comprimir (del enunciado)
const textoOriginal = "Esto reduce la cantidad de bits necesarios para representar la información, sin pérdida de datos.";

// ===================================================================
// CLASE NODO DEL ÁRBOL DE HUFFMAN
// ===================================================================

class NodoHuffman {
    constructor(caracter, frecuencia, izquierdo = null, derecho = null) {
        this.caracter = caracter;
        this.frecuencia = frecuencia;
        this.izquierdo = izquierdo;
        this.derecho = derecho;
    }

    esHoja() {
        return this.izquierdo === null && this.derecho === null;
    }
}

// ===================================================================
// FUNCIONES AUXILIARES
// ===================================================================

/**
 * a) Construye la tabla de frecuencias absolutas de caracteres
 * @param {string} texto - Texto a analizar
 * @returns {Map} - Mapa de caracteres y sus frecuencias
 */
function construirTablaFrecuencias(texto) {
    const frecuencias = new Map();
    
    for (const caracter of texto) {
        frecuencias.set(caracter, (frecuencias.get(caracter) || 0) + 1);
    }
    
    return frecuencias;
}

/**
 * b) Construye el árbol binario de codificación de Huffman
 * @param {Map} frecuencias - Tabla de frecuencias
 * @returns {NodoHuffman} - Raíz del árbol de Huffman
 */
function construirArbolHuffman(frecuencias) {
    // Crear nodos hoja para cada carácter
    const nodos = Array.from(frecuencias.entries()).map(
        ([caracter, frecuencia]) => new NodoHuffman(caracter, frecuencia)
    );
    
    // Mientras haya más de un nodo
    while (nodos.length > 1) {
        // Ordenar por frecuencia (ascendente)
        nodos.sort((a, b) => a.frecuencia - b.frecuencia);
        
        // Tomar los dos nodos con menor frecuencia
        const izquierdo = nodos.shift();
        const derecho = nodos.shift();
        
        // Crear nodo padre con la suma de frecuencias
        const padre = new NodoHuffman(
            null,
            izquierdo.frecuencia + derecho.frecuencia,
            izquierdo,
            derecho
        );
        
        // Agregar el nodo padre a la lista
        nodos.push(padre);
    }
    
    // El último nodo es la raíz del árbol
    return nodos[0];
}

/**
 * c) Genera los códigos binarios para cada carácter
 * @param {NodoHuffman} raiz - Raíz del árbol de Huffman
 * @param {string} codigoActual - Código actual durante el recorrido
 * @param {Map} codigos - Mapa para almacenar los códigos
 * @returns {Map} - Mapa de caracteres y sus códigos binarios
 */
function generarCodigosBinarios(raiz, codigoActual = '', codigos = new Map()) {
    if (raiz === null) return codigos;
    
    // Si es una hoja, guardar el código
    if (raiz.esHoja()) {
        codigos.set(raiz.caracter, codigoActual || '0');
        return codigos;
    }
    
    // Recorrer árbol: izquierda = 0, derecha = 1
    generarCodigosBinarios(raiz.izquierdo, codigoActual + '0', codigos);
    generarCodigosBinarios(raiz.derecho, codigoActual + '1', codigos);
    
    return codigos;
}

/**
 * d) Codifica el texto completo usando los códigos de Huffman
 * @param {string} texto - Texto a codificar
 * @param {Map} codigos - Códigos binarios de Huffman
 * @returns {string} - Texto codificado en binario
 */
function codificarTexto(texto, codigos) {
    let textoCodificado = '';
    
    for (const caracter of texto) {
        textoCodificado += codigos.get(caracter);
    }
    
    return textoCodificado;
}

/**
 * e) Calcula estadísticas de compresión
 * @param {string} textoOriginal - Texto sin comprimir
 * @param {string} textoCodificado - Texto codificado
 * @returns {Object} - Estadísticas de compresión
 */
function calcularEstadisticas(textoOriginal, textoCodificado) {
    const longitudOriginal = textoOriginal.length * 8; // 8 bits por carácter (ASCII)
    const longitudComprimida = textoCodificado.length;
    const reduccion = ((longitudOriginal - longitudComprimida) / longitudOriginal) * 100;
    
    return {
        longitudOriginal,
        longitudComprimida,
        reduccion: reduccion.toFixed(2)
    };
}

// ===================================================================
// FUNCIONES DE VISUALIZACIÓN
// ===================================================================

/**
 * Imprime la tabla de frecuencias (inciso a)
 */
function imprimirTablaFrecuencias(frecuencias) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 a) TABLA DE FRECUENCIAS ABSOLUTAS');
    console.log('='.repeat(70));
    console.log('| Carácter | Frecuencia | Representación |');
    console.log('|----------|------------|----------------|');
    
    // Ordenar por frecuencia descendente
    const sorted = Array.from(frecuencias.entries())
        .sort((a, b) => b[1] - a[1]);
    
    for (const [caracter, frecuencia] of sorted) {
        const repr = caracter === ' ' ? '[ESPACIO]' : 
                     caracter === ',' ? '[COMA]' : 
                     caracter === '.' ? '[PUNTO]' : caracter;
        console.log(`| '${caracter.padEnd(8)}' | ${String(frecuencia).padEnd(10)} | ${repr.padEnd(14)} |`);
    }
    console.log('='.repeat(70) + '\n');
}

/**
 * Imprime el árbol de Huffman (inciso b)
 */
function imprimirArbolHuffman(raiz, prefijo = '', esUltimo = true) {
    if (raiz === null) return;
    
    const conector = esUltimo ? '└── ' : '├── ';
    const info = raiz.esHoja() 
        ? `'${raiz.caracter === ' ' ? '[ESPACIO]' : raiz.caracter}' (${raiz.frecuencia})`
        : `[NODO] (${raiz.frecuencia})`;
    
    console.log(prefijo + conector + info);
    
    const nuevoPrefijo = prefijo + (esUltimo ? '    ' : '│   ');
    
    if (!raiz.esHoja()) {
        imprimirArbolHuffman(raiz.izquierdo, nuevoPrefijo, false);
        imprimirArbolHuffman(raiz.derecho, nuevoPrefijo, true);
    }
}

/**
 * Imprime la matriz de codificación (inciso c)
 */
function imprimirMatrizCodificacion(codigos, frecuencias) {
    console.log('\n' + '='.repeat(70));
    console.log('🔢 c) MATRIZ DE CODIFICACIÓN BINARIA');
    console.log('='.repeat(70));
    console.log('| Carácter | Frecuencia | Código Binario |');
    console.log('|----------|------------|----------------|');
    
    // Ordenar por longitud de código (más eficientes primero)
    const sorted = Array.from(codigos.entries())
        .sort((a, b) => a[1].length - b[1].length);
    
    for (const [caracter, codigo] of sorted) {
        const freq = frecuencias.get(caracter);
        const repr = caracter === ' ' ? '[ESP]' : 
                     caracter === ',' ? '[COM]' : 
                     caracter === '.' ? '[PUN]' : caracter;
        console.log(`| '${repr.padEnd(8)}' | ${String(freq).padEnd(10)} | ${codigo.padEnd(14)} |`);
    }
    console.log('='.repeat(70) + '\n');
}

/**
 * Imprime el texto codificado (inciso d)
 */
function imprimirTextoCodificado(textoCodificado) {
    console.log('\n' + '='.repeat(70));
    console.log('📝 d) TEXTO COMPLETO CODIFICADO EN BINARIO');
    console.log('='.repeat(70));
    
    // Imprimir en bloques de 64 bits para mejor legibilidad
    const bloques = textoCodificado.match(/.{1,64}/g) || [];
    bloques.forEach((bloque, index) => {
        console.log(`${String(index + 1).padStart(3, '0')}: ${bloque}`);
    });
    
    console.log('='.repeat(70) + '\n');
}

/**
 * Imprime estadísticas de compresión (inciso e)
 */
function imprimirEstadisticas(stats, textoOriginal) {
    console.log('\n' + '='.repeat(70));
    console.log('📈 e) ANÁLISIS DE COMPRESIÓN');
    console.log('='.repeat(70));
    console.log(`📄 Texto original: "${textoOriginal}"`);
    console.log(`📏 Longitud del texto: ${textoOriginal.length} caracteres\n`);
    console.log(`🔹 Representación original (8 bits/carácter):`);
    console.log(`   └─ Total: ${stats.longitudOriginal} bits\n`);
    console.log(`🔹 Representación comprimida (Huffman):`);
    console.log(`   └─ Total: ${stats.longitudComprimida} bits\n`);
    console.log(`🎯 Porcentaje de reducción logrado: ${stats.reduccion}%`);
    console.log(`💾 Bits ahorrados: ${stats.longitudOriginal - stats.longitudComprimida} bits`);
    console.log('='.repeat(70) + '\n');
}

/**
 * Guarda los resultados en un archivo de texto
 */
function guardarResultados(frecuencias, codigos, textoCodificado, stats, textoOriginal) {
    const timestamp = Date.now();
    const nombreArchivo = `resultado_huffman_${timestamp}.txt`;
    const rutaArchivo = path.join(__dirname, nombreArchivo);
    
    let contenido = '';
    
    contenido += '='.repeat(70) + '\n';
    contenido += 'EJERCICIO 2: COMPRESIÓN DE DATOS - CODIFICACIÓN DE HUFFMAN\n';
    contenido += '='.repeat(70) + '\n\n';
    
    contenido += 'TEXTO ORIGINAL:\n';
    contenido += `"${textoOriginal}"\n\n`;
    
    contenido += '='.repeat(70) + '\n';
    contenido += 'a) TABLA DE FRECUENCIAS ABSOLUTAS\n';
    contenido += '='.repeat(70) + '\n';
    Array.from(frecuencias.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([car, freq]) => {
            const repr = car === ' ' ? '[ESPACIO]' : car;
            contenido += `'${car}' -> ${freq} apariciones (${repr})\n`;
        });
    
    contenido += '\n' + '='.repeat(70) + '\n';
    contenido += 'c) MATRIZ DE CODIFICACIÓN BINARIA\n';
    contenido += '='.repeat(70) + '\n';
    Array.from(codigos.entries())
        .sort((a, b) => a[1].length - b[1].length)
        .forEach(([car, codigo]) => {
            const repr = car === ' ' ? '[ESPACIO]' : car;
            contenido += `'${car}' (${repr}) -> ${codigo}\n`;
        });
    
    contenido += '\n' + '='.repeat(70) + '\n';
    contenido += 'd) TEXTO CODIFICADO EN BINARIO\n';
    contenido += '='.repeat(70) + '\n';
    const bloques = textoCodificado.match(/.{1,64}/g) || [];
    bloques.forEach((bloque, index) => {
        contenido += `${String(index + 1).padStart(3, '0')}: ${bloque}\n`;
    });
    
    contenido += '\n' + '='.repeat(70) + '\n';
    contenido += 'e) ANÁLISIS DE COMPRESIÓN\n';
    contenido += '='.repeat(70) + '\n';
    contenido += `Longitud original (8 bits/carácter): ${stats.longitudOriginal} bits\n`;
    contenido += `Longitud comprimida (Huffman): ${stats.longitudComprimida} bits\n`;
    contenido += `Porcentaje de reducción: ${stats.reduccion}%\n`;
    contenido += `Bits ahorrados: ${stats.longitudOriginal - stats.longitudComprimida} bits\n`;
    
    fs.writeFileSync(rutaArchivo, contenido, 'utf8');
    console.log(`💾 Resultados guardados en: ${nombreArchivo}\n`);
}

// ===================================================================
// FUNCIÓN PRINCIPAL
// ===================================================================

function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║   EJERCICIO 2: COMPRESIÓN DE DATOS - HUFFMAN (35 PUNTOS)          ║');
    console.log('║   Técnica: Transformar y Conquistar (Codificación Prefijo Óptima) ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');
    
    console.log(`\n📄 Texto a comprimir:\n"${textoOriginal}"\n`);
    
    // a) Construir tabla de frecuencias
    console.log('🔄 Paso a) Construyendo tabla de frecuencias...');
    const frecuencias = construirTablaFrecuencias(textoOriginal);
    imprimirTablaFrecuencias(frecuencias);
    
    // b) Construir árbol de Huffman
    console.log('🔄 Paso b) Construyendo árbol binario de codificación de Huffman...\n');
    const arbolHuffman = construirArbolHuffman(frecuencias);
    console.log('🌳 ÁRBOL DE HUFFMAN (Proceso de combinación de nodos):');
    imprimirArbolHuffman(arbolHuffman);
    
    // c) Generar códigos binarios
    console.log('\n🔄 Paso c) Generando códigos binarios...');
    const codigos = generarCodigosBinarios(arbolHuffman);
    imprimirMatrizCodificacion(codigos, frecuencias);
    
    // d) Codificar texto completo
    console.log('🔄 Paso d) Codificando texto completo...');
    const textoCodificado = codificarTexto(textoOriginal, codigos);
    imprimirTextoCodificado(textoCodificado);
    
    // e) Calcular estadísticas
    console.log('🔄 Paso e) Calculando estadísticas de compresión...');
    const stats = calcularEstadisticas(textoOriginal, textoCodificado);
    imprimirEstadisticas(stats, textoOriginal);
    
    // Guardar resultados en archivo
    guardarResultados(frecuencias, codigos, textoCodificado, stats, textoOriginal);
    
    console.log('='.repeat(70));
    console.log('✅ FIN DE LA EJECUCIÓN');
    console.log('='.repeat(70) + '\n');
}

// Ejecutar el programa
main();