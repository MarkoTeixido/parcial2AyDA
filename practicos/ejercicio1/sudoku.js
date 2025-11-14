// ===================================================================
// EJERCICIO 1: SOLUCIONADOR DE SUDOKU
// Técnica: Backtracking (Resolución Exacta)
// ===================================================================

// Sudoku de ejemplo del examen (9x9)
const sudokuInicial = [
    [0, 0, 4, 0, 0, 0, 7, 0, 0],
    [0, 8, 5, 0, 1, 0, 2, 9, 0],
    [1, 0, 0, 3, 0, 4, 0, 0, 8],
    [0, 0, 1, 0, 6, 8, 9, 0, 0],
    [0, 5, 0, 9, 0, 1, 0, 8, 0],
    [0, 0, 9, 2, 3, 0, 1, 0, 0],
    [5, 0, 0, 1, 0, 9, 0, 0, 7],
    [0, 9, 6, 0, 8, 0, 3, 2, 0],
    [0, 0, 8, 0, 0, 0, 5, 0, 0],
];

// ===================================================================
// FUNCIONES AUXILIARES
// ===================================================================

/**
 * Verifica si es seguro colocar un número en una posición específica
 * @param {number[][]} tablero - Tablero de Sudoku
 * @param {number} fila - Fila donde se quiere colocar el número
 * @param {number} col - Columna donde se quiere colocar el número
 * @param {number} num - Número a colocar (1-9)
 * @returns {boolean} - true si es válido, false si no
 */
function esSeguro(tablero, fila, col, num) {
    // Verificar fila
    for (let x = 0; x < 9; x++) {
        if (tablero[fila][x] === num) {
            return false;
        }
    }
    
    // Verificar columna
    for (let x = 0; x < 9; x++) {
        if (tablero[x][col] === num) {
            return false;
        }
    }
    
    // Verificar subcuadro 3x3
    const inicioFila = fila - (fila % 3);
    const inicioCol = col - (col % 3);
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tablero[i + inicioFila][j + inicioCol] === num) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Encuentra la siguiente celda vacía en el tablero
 * @param {number[][]} tablero - Tablero de Sudoku
 * @returns {number[]|null} - [fila, col] de la celda vacía, o null si no hay
 */
function encontrarCeldaVacia(tablero) {
    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {
            if (tablero[fila][col] === 0) {
                return [fila, col];
            }
        }
    }
    return null;
}

// ===================================================================
// ALGORITMO DE BACKTRACKING
// ===================================================================

/**
 * Resuelve el Sudoku usando Backtracking (técnica de resolución exacta)
 * @param {number[][]} tablero - Tablero de Sudoku
 * @returns {boolean} - true si se resolvió, false si no tiene solución
 */
function resolverSudoku(tablero) {
    const celdaVacia = encontrarCeldaVacia(tablero);
    
    // Si no hay celdas vacías, el Sudoku está resuelto
    if (celdaVacia === null) {
        return true;
    }
    
    const [fila, col] = celdaVacia;
    
    // Intentar números del 1 al 9
    for (let num = 1; num <= 9; num++) {
        if (esSeguro(tablero, fila, col, num)) {
            // Asignar número (paso de avance)
            tablero[fila][col] = num;
            
            // Recursión: intentar resolver el resto
            if (resolverSudoku(tablero)) {
                return true;
            }
            
            // Backtracking: deshacer la asignación
            tablero[fila][col] = 0;
        }
    }
    
    // Si ningún número funciona, retroceder
    return false;
}

// ===================================================================
// FUNCIONES DE VISUALIZACIÓN
// ===================================================================

/**
 * Imprime el tablero de Sudoku en formato legible
 * @param {number[][]} tablero - Tablero de Sudoku
 * @param {string} titulo - Título a mostrar
 */
function imprimirTablero(tablero, titulo) {
    console.log('\n' + '='.repeat(50));
    console.log(titulo);
    console.log('='.repeat(50));
    
    for (let i = 0; i < 9; i++) {
        if (i % 3 === 0 && i !== 0) {
            console.log('------+-------+------');
        }
        
        let fila = '';
        for (let j = 0; j < 9; j++) {
            if (j % 3 === 0 && j !== 0) {
                fila += '| ';
            }
            fila += (tablero[i][j] === 0 ? '_' : tablero[i][j]) + ' ';
        }
        console.log(fila);
    }
    console.log('='.repeat(50) + '\n');
}

/**
 * Copia profunda de un tablero
 * @param {number[][]} tablero - Tablero original
 * @returns {number[][]} - Copia del tablero
 */
function copiarTablero(tablero) {
    return tablero.map(fila => [...fila]);
}

// ===================================================================
// FUNCIÓN PRINCIPAL
// ===================================================================

function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     EJERCICIO 1: SOLUCIONADOR DE SUDOKU (35 PUNTOS)   ║');
    console.log('║          Técnica: Backtracking (Resolución Exacta)    ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    // Copiar el tablero inicial para no modificarlo
    const tablero = copiarTablero(sudokuInicial);
    
    // Mostrar tablero inicial
    imprimirTablero(tablero, '📋 SUDOKU INICIAL (PROBLEMA A RESOLVER)');
    
    // Resolver el Sudoku
    console.log('🔄 Resolviendo Sudoku usando Backtracking...\n');
    
    const inicio = Date.now();
    const resuelto = resolverSudoku(tablero);
    const fin = Date.now();
    
    const tiempoEjecucion = fin - inicio;
    
    // Mostrar resultado
    if (resuelto) {
        imprimirTablero(tablero, '✅ SUDOKU RESUELTO CORRECTAMENTE');
        
        console.log('📊 ESTADÍSTICAS:');
        console.log(`   ⏱️  Tiempo de ejecución: ${tiempoEjecucion} ms`);
        console.log(`   🎯 Estado: SOLUCIÓN ENCONTRADA`);
        console.log(`   🧮 Técnica utilizada: Backtracking (Branch and Bound)`);
        console.log(`   📐 Complejidad: O(9^n) donde n = celdas vacías`);
        
    } else {
        console.log('❌ No se encontró solución para este Sudoku');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('FIN DE LA EJECUCIÓN');
    console.log('='.repeat(50) + '\n');
}

// Ejecutar el programa
main();