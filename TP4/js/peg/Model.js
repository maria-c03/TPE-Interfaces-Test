
class Model {
    constructor() {
        this.FILAS = 7;
        this.COLS = 7;
        this.HUECO_INICIAL = { row: 3, col: 3 };
        this.OFFSET_X = 485; // Desplazamiento horizontal del tablero en el canvas
        this.OFFSET_Y = 80;  // Desplazamiento vertical del tablero en el canvas
        this.TAMAÑO_CELDA = 100;
        this.RADIO_FICHA = 40; 
        

        this.estado = this.crearEstadoVacio();
        this.fichas = []; 
        this.tipoFicha = null; // Ruta de la imagen de la ficha seleccionada
        this.timeLimit = 120;
        this.remainingTime = 0; // Tiempo restante actual
        this.recordTime = null; // Mejor tiempo registrado
        
        this.DIRECCIONES = [
            { dRow: -2, dCol: 0 },  // Arriba
            { dRow: 2, dCol: 0 },   // Abajo
            { dRow: 0, dCol: -2 },  // Izquierda
            { dRow: 0, dCol: 2 }    // Derecha
        ];
    }

    crearEstadoVacio() {
        // -1: posición fuera del tablero (esquinas)
        // 0: posición vacía válida
        // 1: posición ocupada con ficha
        return [
            [-1, -1, 0, 0, 0, -1, -1],
            [-1, -1, 0, 0, 0, -1, -1],
            [ 0,  0, 0, 0, 0,  0,  0],
            [ 0,  0, 0, 0, 0,  0,  0],
            [ 0,  0, 0, 0, 0,  0,  0],
            [-1, -1, 0, 0, 0, -1, -1],
            [-1, -1, 0, 0, 0, -1, -1]
        ];
    }


    inicializarTablero() {
        this.estado = this.crearEstadoVacio();
        
        // Llenar todas las posiciones válidas con fichas excepto el centro
        for (let row = 0; row < this.FILAS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.estado[row][col] === 0 && 
                    !(row === this.HUECO_INICIAL.row && col === this.HUECO_INICIAL.col)) {
                    this.estado[row][col] = 1; // Colocar ficha
                }
            }
        }
        this.crearFichas();
    }

    //  Crea las instancias de objetos Ficha basándose en el estado del tablero
    //  Solo crea fichas donde el estado es 1 (posición ocupada)
    crearFichas() {
        if (!this.tipoFicha) return; // No crear fichas si no se seleccionó tipo
        
        this.fichas = [];
        for (let row = 0; row < this.FILAS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.estado[row][col] === 1) {
                    // Calcular posición en píxeles
                    const x = this.OFFSET_X + col * this.TAMAÑO_CELDA;
                    const y = this.OFFSET_Y + row * this.TAMAÑO_CELDA;
                    const ficha = new Ficha(x, y, this.tipoFicha, this.RADIO_FICHA);
                    ficha.setFilaColumna(row, col);
                    this.fichas.push(ficha);
                }
            }
        }
    }

    getPosicionCelda(row, col) {
        return {
            x: this.OFFSET_X + col * this.TAMAÑO_CELDA,
            y: this.OFFSET_Y + row * this.TAMAÑO_CELDA
        };
    }
   
    //  Un movimiento es válido si salta sobre otra ficha hacia un espacio vacío
    calcularMovimientosValidos(ficha) {
        const movimientos = [];
        // Verificar cada dirección posible (arriba, abajo, izquierda, derecha)
        for (let dir of this.DIRECCIONES) {
            const destRow = ficha.row + dir.dRow;
            const destCol = ficha.col + dir.dCol;
            const medioRow = ficha.row + dir.dRow / 2;
            const medioCol = ficha.col + dir.dCol / 2;

            if (this.esMovimientoValido(destRow, destCol, medioRow, medioCol)) {
                const pos = this.getPosicionCelda(destRow, destCol);
                movimientos.push({ row: destRow, col: destCol, ...pos });
            }
        }
        return movimientos;
    }

    esMovimientoValido(destRow, destCol, medioRow, medioCol) {
        return destRow >= 0 && destRow < this.FILAS &&
               destCol >= 0 && destCol < this.COLS &&
               this.estado[medioRow][medioCol] === 1 && // Hay ficha en el medio
               this.estado[destRow][destCol] === 0; // El destino está vacío
    }

    moverFicha(ficha, destinoRow, destinoCol) {
        const dRow = destinoRow - ficha.row;
        const dCol = destinoCol - ficha.col;
        const medioRow = ficha.row + dRow / 2;
        const medioCol = ficha.col + dCol / 2;

        if (!this.esMovimientoValido(destinoRow, destinoCol, medioRow, medioCol)) {
            return false; // Movimiento inválido
        }

        this.estado[ficha.row][ficha.col] = 0; // La posición original queda vacía
        this.estado[medioRow][medioCol] = 0; // La ficha saltada desaparece
        this.estado[destinoRow][destinoCol] = 1; // El destino ahora tiene ficha

        // Eliminar la ficha saltada del array de fichas
        this.fichas = this.fichas.filter(f => !(f.row === medioRow && f.col === medioCol));
        
        ficha.setFilaColumna(destinoRow, destinoCol);
        return true;
    }

    tieneMovimientosValidos() {
        return this.fichas.some(ficha => this.calcularMovimientosValidos(ficha).length > 0);
    }

    verificarVictoria() {
        return this.fichas.length === 1 && 
               this.fichas[0].row === this.HUECO_INICIAL.row && 
               this.fichas[0].col === this.HUECO_INICIAL.col;
    }
  
    //  Encuentra la celda del tablero más cercana a unas coordenadas de canvas
    //   para determinar dónde soltar una ficha en drag and drop
    encontrarCeldaMasCercana(x, y) {
        let mejorCelda = null;
        let minDist = Infinity;

        for (let row = 0; row < this.FILAS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.estado[row][col] !== -1) { // Solo celdas válidas del tablero
                    const pos = this.getPosicionCelda(row, col);
                    const dist = Math.hypot(pos.x - x, pos.y - y); // Distancia euclidiana
                    if (dist < minDist) {
                        minDist = dist;
                        mejorCelda = { row, col, ...pos };
                    }
                }
            }
        }
        return mejorCelda;
    }

    
//   Reinicia el juego a su estado inicial
//   Reinicializa el tablero y restaura el tiempo 
    reiniciar() {
        this.inicializarTablero();
        this.remainingTime = this.timeLimit;
    }
}
