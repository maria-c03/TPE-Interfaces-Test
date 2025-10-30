class TableroVista {
    constructor(canvasId, tablero) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.tablero = tablero;

        this.canvas.style.backgroundColor = "black";

        // Posición inicial del tablero dentro del canvas
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        // VARIABLES PARA EL DRAG-AND-DROP 
        this.lastClickedFigure = null;
        this.isMouseDown = false;
        
        //ENLAZAR Y REGISTRAR EVENTOS
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    }

    draw() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = this.tablero.backgroundImage;
        if (!img.complete) return; // esperar a que cargue

        const canvasHeight = canvas.height;
        const scale = canvasHeight / img.height;
        const newWidth = img.width * scale;
        const x = (canvas.width - newWidth) / 2;
        const y = 0;

        this.x = x;
        this.y = y;
        this.width = newWidth;
        this.height = canvasHeight;

        ctx.drawImage(img, x, y, newWidth, canvasHeight);

        // Dibujo todas las fichas
        this.tablero.getFichas().forEach(ficha => ficha.draw(ctx));
    }

    // Genera posiciones de los huecos según la máscara de 7x7
    generarPosicionesCruz() {
        const positions = [];

        const crossMask = [
            [-1, -1, 1, 1, 1, -1, -1],
            [-1, -1, 1, 1, 1, -1, -1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [-1, -1, 1, 1, 1, -1, -1],
            [-1, -1, 1, 1, 1, -1, -1],
        ];

        const rows = crossMask.length;
        const cols = crossMask[0].length;
        const cellWidth = this.width / cols;
        const cellHeight = this.height / rows;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (crossMask[y][x] === 1) {
                    const posX = this.x + x * cellWidth + cellWidth / 2;
                    const posY = this.y + y * cellHeight + cellHeight / 2;
                    positions.push({ x: posX, y: posY });
                }
            }
        }
        return positions;
    }

    findClickedFigure(x, y) {
        const fichas = this.tablero.getFichas();
        // Recorrer las fichas en orden inverso para que las dibujadas al final (más arriba) se detecten primero
        for (let i = fichas.length - 1; i >= 0; i--) {
            const ficha = fichas[i];
            if (ficha.isPointInside(x, y)) {
                return ficha;
            }
        }
        return null;
    }
    onMouseDown(e) {
        this.isMouseDown = true;
        // 1. Si había una ficha seleccionada, la desresalta
        if (this.lastClickedFigure != null) {
            this.lastClickedFigure.setResaltado(false);
            this.lastClickedFigure = null;
        }

        // 2. Busca si se ha clickeado una nueva ficha
        let clickFig = this.findClickedFigure(e.layerX, e.layerY);
        if (clickFig != null) {
            clickFig.setResaltado(true); // Puedes elegir el color
            this.lastClickedFigure = clickFig;
        }
        this.draw(); // Redibuja
    }

    onMouseMove(e) {
        if (this.isMouseDown && this.lastClickedFigure != null) {
            // 3. Mueve la ficha seleccionada
            this.lastClickedFigure.setPosition(e.layerX, e.layerY);
            this.draw(); // Redibuja para mostrar la nueva posición
        }
    }

    onMouseUp(e) {
        this.isMouseDown = false;
        // Aquí podrías agregar la lógica para verificar si el movimiento es válido
    }
}
