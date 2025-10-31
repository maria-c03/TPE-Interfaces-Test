class Tablero {
    constructor() {
        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/imgPeg/tablero.png";
        this.loaded = false;
        this.fichas = [];
        this.tipoFicha = null; // al inicio no hay ficha seleccionada

        // Estado vacío (sin fichas)
        this.estado = [
            [-1, -1, 0, 0, 0, -1, -1],
            [-1, -1, 0, 0, 0, -1, -1],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [-1, -1, 0, 0, 0, -1, -1],
            [-1, -1, 0, 0, 0, -1, -1]
        ];

        this.backgroundImage.onload = () => {
            this.loaded = true;
        };
    }

    llenarTableroConHueco(rowHueco, colHueco) {
        this.estado = [
            [-1, -1, 1, 1, 1, -1, -1],
            [-1, -1, 1, 1, 1, -1, -1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [-1, -1, 1, 1, 1, -1, -1],
            [-1, -1, 1, 1, 1, -1, -1]
        ];

        // Dejar hueco donde hizo clic el jugador
        this.estado[rowHueco][colHueco] = 0;

        // Crear las fichas
        this.inicializarFichas();
    }

    generarPosicionesCruz() {
        const posiciones = [];
        const offsetX = 485;
        const offsetY = 80;
        const size = 100;

        for (let row = 0; row < this.estado.length; row++) {
            for (let col = 0; col < this.estado[row].length; col++) {
                if (this.estado[row][col] !== -1) {
                    posiciones.push({
                        row,
                        col,
                        x: offsetX + col * size,
                        y: offsetY + row * size
                    });
                }
            }
        }
        return posiciones;
    }

    inicializarFichas() {
        if (!this.tipoFicha) return; // no crear fichas si no hay seleccionada

        this.fichas = [];
        const posiciones = this.generarPosicionesCruz();
        const radioFicha = 40;

        posiciones.forEach(pos => {
            if (this.estado[pos.row][pos.col] === 1) {
                const ficha = new Ficha(pos.x, pos.y, this.tipoFicha, radioFicha);
                ficha.setFilaColumna(pos.row, pos.col);
                this.agregarFicha(ficha);
            }
        });

        if (this.fichas.length >= 32) {
            const manualPos = [
                [690, 80], [790, 80], [890, 80],
                [690, 180], [790, 180], [890, 180],
                [484, 280], [585, 280], [690, 280], [790, 280], [890, 280], [990, 280], [1090, 280],
                [484, 380], [585, 380], [690, 380], [890, 380], [990, 380], [1090, 380],
                [484, 480], [585, 480], [690, 480], [790, 480], [890, 480], [990, 480], [1090, 480],
                [690, 580], [790, 580], [890, 580], [690, 680], [790, 680], [890, 680]
            ];
            this.fichas.forEach((f, i) => {
                if (manualPos[i]) f.setPosition(manualPos[i][0], manualPos[i][1]);
            });
        }
    }

    agregarFicha(ficha) { this.fichas.push(ficha); }
    getFichas() { return this.fichas; }
    getEstado() { return this.estado; }

    reiniciar() {
        this.estado = [
            [-1, -1, 1, 1, 1, -1, -1],
            [-1, -1, 1, 1, 1, -1, -1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [-1, -1, 1, 1, 1, -1, -1],
            [-1, -1, 1, 1, 1, -1, -1]
        ];

        this.inicializarFichas();
    }
}
// ----------INICIALIZACION-----------
document.addEventListener("DOMContentLoaded", function () {
    const tablero = new Tablero();
    tablero.backgroundImage.onload = () => {
        const tableroVista = new TableroVista("canvasPeg", tablero);
        // Dibujar el tablero inicial
        tableroVista.draw();
        const btnReiniciar = document.getElementById("btnReiniciar");
        if (btnReiniciar) {
            btnReiniciar.addEventListener("click", () => {
                tablero.reiniciar();
                tableroVista.draw();
            });
        }
    };
});