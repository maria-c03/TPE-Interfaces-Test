class TableroVista {
    constructor(canvasId, tablero) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.tablero = tablero;

        this.canvas.style.backgroundColor = "black";

        // Posición del tablero
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        // Variables de interacción
        this.lastClickedFigure = null;
        this.isMouseDown = false;
        this.hints = [];
        this.animAngle = 0;

        // estado del juego
        this.gameState = "inicio"; // "inicio" | "jugando" | "fin" | "seleccionFichas"
        this.imagenesFichas = [
            { src: "img/imgPeg/homer2.png", img: new Image() },
            { src: "img/imgPeg/lissa2.png", img: new Image() },
            { src: "img/imgPeg/bart2.png", img: new Image() }
        ];
        this.imagenesFichas.forEach(f => f.img.src = f.src);

        // botones
        this.botones = [];
        this.crearBotones();

        // imagen fondo inicio
        this.backgroundImageInicio = new Image();
        this.backgroundImageInicio.src = "img/imgJuegos/re_peg-solitarie.png"; 
        this.backgroundImageInicio.onload = () => {
            this.draw();
        };

        // Eventos
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

        requestAnimationFrame(() => this.animateHints());
    }
    // creacion de botones según el estado
    crearBotones() {
        this.botones = [];
        if (this.gameState === "inicio") {
            this.botones.push(new Button(731, 325, 100, 100, "", "circle"));
        }
        else if (this.gameState === "jugando") {
            this.botones.push(new Button(1150, 80, 120, 50, "Fichas", "rect"));
            this.botones.push(new Button(1150, 150, 120, 50, "Reiniciar", "rect"));
        }
    }
    // dibujo UI
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameState === "seleccionFichas") {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.fillStyle = "white";
            ctx.font = "bold 36px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Selecciona tu tipo de ficha", 750, 220);

            const startX = this.canvas.width / 2 - 300;
            const y = this.canvas.height / 2 - 100;
            const size = 150;

            this.imagenesFichas.forEach((f, i) => {
                const x = startX + i * 200;
                ctx.drawImage(f.img, x, y, size, size);
                f.x = x;
                f.y = y;
                f.size = size;
            });

            this.botones.forEach(b => b.draw(ctx));
            return;
        }
        // --- estado de inicio ---
        if (this.gameState === "inicio") {
            if (this.backgroundImageInicio.complete) {
                ctx.drawImage(this.backgroundImageInicio, 0, 0, this.canvas.width, this.canvas.height);
            }
            this.botones.forEach(b => b.draw(ctx));
            return;
        }
        // --- estado de juego ---
        const img = this.tablero.backgroundImage;
        if (!img.complete) return;

        const canvasHeight = this.canvas.height;
        const scale = canvasHeight / img.height;
        const newWidth = img.width * scale;
        const x = (this.canvas.width - newWidth) / 2;
        this.x = x;
        this.width = newWidth;
        this.height = canvasHeight;

        ctx.drawImage(img, x, 0, newWidth, canvasHeight);

        // dibujo las fichas
        const fichas = this.tablero.getFichas();
        fichas.forEach(ficha => {
            if (ficha !== this.lastClickedFigure) ficha.draw(ctx);
        });
        if (this.lastClickedFigure) this.lastClickedFigure.draw(ctx);

        if (this.hints.length > 0) this.drawHints(ctx);

        // boton de ayuda y reiniciar
        this.botones.forEach(b => b.draw(ctx));
    }

    handleButtonClick(boton) {
        // --- estado inicio ---
        if (this.gameState === "inicio") {
            this.gameState = "jugando";
            // Llenar el tablero automáticamente con hueco central (fila 3, col 3)
            if (this.tablero.getFichas().length === 0) {
                console.log("Iniciando tablero al presionar Play");
                this.tablero.llenarTableroConHueco(3, 3);
            }
            this.crearBotones();
            this.draw();
            return;
        }
        // --- estado jugando ---
        if (this.gameState === "jugando") {
            if (boton.text === "Fichas") {
                // Pasar a selección de fichas
                this.gameState = "seleccionFichas";
                this.crearBotones();
                this.draw();
                return;
            }
            if (boton.text === "Reiniciar") {
                this.tablero.reiniciar();
                const esperarFichas = () => {
                    const todasCargadas = this.tablero.getFichas().every(f => f.loaded);
                    if (todasCargadas) {
                        this.hints = [];
                        this.lastClickedFigure = null;
                        this.crearBotones();
                        this.draw();
                    } else {
                        requestAnimationFrame(esperarFichas);
                    }
                };
                esperarFichas();
                return;
            }
        }
        // --- estado selección de fichas ---
        if (this.gameState === "seleccionFichas") {
            // verifico si se clickeó alguna imagen de ficha
            for (let f of this.imagenesFichas) {
                if (
                    boton.x >= f.x && boton.x <= f.x + f.size &&
                    boton.y >= f.y && boton.y <= f.y + f.size
                ) {
                    this.cambiarFichas(f.src);
                    return;
                }
            }
        }
    }

    // generar posiciones de los huecos según la máscara de 7x7
    generarPosicionesCruz() {
        return this.tablero.generarPosicionesCruz();
    }

    findClickedFigure(x, y) {
        const fichas = this.tablero.getFichas();
        for (let i = fichas.length - 1; i >= 0; i--) {
            const ficha = fichas[i];
            if (ficha.isPointInside(x, y)) {
                return ficha;
            }
        }
        return null;
    }
    // busca los posibles lugares donde soltar la ficha seleccionada
    calcularHints(ficha) {
        const hints = [];
        const estado = this.tablero.getEstado();
        const posiciones = this.generarPosicionesCruz();
        // posibles direcciones (arriba, abajo, izq, der)
        const direcciones = [
            { dRow: -2, dCol: 0 }, // arriba
            { dRow: 2, dCol: 0 },  // abajo
            { dRow: 0, dCol: -2 }, // izquierda
            { dRow: 0, dCol: 2 }   // derecha
        ];

        for (let dir of direcciones) {
            const destinoRow = ficha.row + dir.dRow;
            const destinoCol = ficha.col + dir.dCol;
            const medioRow = ficha.row + dir.dRow / 2;
            const medioCol = ficha.col + dir.dCol / 2;

            // verifico que este dentro del tablero y sea un movimiento valido
            if (
                destinoRow >= 0 && destinoRow < 7 &&
                destinoCol >= 0 && destinoCol < 7 &&
                estado[medioRow][medioCol] === 1 &&
                estado[destinoRow][destinoCol] === 0
            ) {
                const pos = posiciones.find(p => p.row === destinoRow && p.col === destinoCol);
                if (pos) hints.push(pos);
            }
        }
        this.hints = hints;
    }
    // -----HINTS ANIMADO-----
    drawHints(ctx) {
        const t = (Math.sin(this.animAngle) + 1) / 2; // animación oscilante entre 0 y 1
        ctx.save();
        ctx.strokeStyle = "#F72585";
        ctx.lineWidth = 8;

        this.hints.forEach(pos => {
            const size = 25 + 10 * t; // flecha crece y achica
            const x = pos.x;
            const y = pos.y - 50 - 10 * t; // pos arriba del hueco

            // se dibuja una flecha simple hacia abajo
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + size);
            ctx.moveTo(x - size / 3, y + size * 0.6);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x + size / 3, y + size * 0.6);
            ctx.stroke();
            ctx.closePath();
        });

        ctx.restore();
    }
    //-----animacion continua------
    animateHints() {
        this.animAngle += 0.1;
        if (this.hints.length > 0) this.draw();
        requestAnimationFrame(() => this.animateHints());
    }

    obtenerCeldaDesdeClick(x, y) {
        const posiciones = this.generarPosicionesCruz();
        for (let pos of posiciones) {
            const dx = pos.x - x;
            const dy = pos.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50) { 
                return pos;
            }
        }
        return null;
    }

    cambiarFichas(src) {
    // asignar la ficha seleccionada
    this.tablero.tipoFicha = src;

    // Si el tablero aún no tiene fichas, llenarlo con hueco central
    if (this.tablero.getFichas().length === 0) {
        this.tablero.llenarTableroConHueco(3, 3); // fila 3, col 3
    } else {
        // si ya hay fichas, solo cambiar la imagen de las fichas existentes
        this.tablero.getFichas().forEach(f => f.imagen.src = src);
    }
    this.gameState = "jugando";
    this.crearBotones();
    this.draw();
}
    // ------Eventos--------
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // --- verifico si se clickeó un botón ---
        for (let b of this.botones) {
            if (b.isClicked(mouseX, mouseY)) {
                this.handleButtonClick(b);
                return;
            }
        }

        // --- caso selección de fichas ---
        if (this.gameState === "seleccionFichas") {
            // verifico si clickeo una ficha
            for (let f of this.imagenesFichas) {
                if (
                    mouseX >= f.x && mouseX <= f.x + f.size &&
                    mouseY >= f.y && mouseY <= f.y + f.size
                ) {
                    this.cambiarFichas(f.src);
                    return;
                }
            }
            return;
        }

        // --- si estamos jugando pero no se eligió ficha, ir a selección ---
        if (this.gameState === "jugando" && !this.tablero.tipoFicha) {
            this.gameState = "seleccionFichas";
            this.crearBotones();
            this.draw();
            return;
        }

        // --- si estamos jugando y ya hay ficha elegida ---
        if (this.gameState === "jugando" && this.tablero.tipoFicha) {
            // Si el tablero está vacío, llenarlo con el hueco donde clickeó
            if (this.tablero.getFichas().length === 0) {
                const pos = this.obtenerCeldaDesdeClick(mouseX, mouseY);
                if (pos) {
                    this.tablero.llenarTableroConHueco(pos.row, pos.col);
                    this.draw();
                }
                return;
            }

            // seleccionar una ficha si se clickeo
            if (this.lastClickedFigure) {
                this.lastClickedFigure.setResaltado(false);
                this.hints = [];
                this.lastClickedFigure = null;
            }
            // resaltar ficha
            const clickFig = this.findClickedFigure(mouseX, mouseY);
            if (clickFig) {
                clickFig.setResaltado(true);
                this.lastClickedFigure = clickFig;
                clickFig._originalPos = {
                    x: clickFig.posX,
                    y: clickFig.posY,
                    row: clickFig.row,
                    col: clickFig.col
                };
                this.calcularHints(clickFig);
                this.isMouseDown = true;
            }
            this.draw();
        }
    }

    onMouseMove(e) {
        if (!this.isMouseDown || !this.lastClickedFigure) return;
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // muevo la ficha seleccionada a la posición del mouse 
        this.lastClickedFigure.setPosition(mouseX, mouseY);
        this.draw();
    }

    onMouseUp(e) {
        this.isMouseDown = false;

        if (!this.lastClickedFigure) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const ficha = this.lastClickedFigure;
        const tablero = this.tablero;
        const estado = tablero.getEstado();

        // busco la posición mas cercana
        const posiciones = this.generarPosicionesCruz();
        let destino = null;
        let minDist = Infinity;

        posiciones.forEach(pos => {
            const dx = pos.x - mouseX;
            const dy = pos.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                destino = pos;
            }
        });

        let movimientoValido = false;

        if (destino && estado[destino.row][destino.col] === 0) {
            const dRow = destino.row - ficha.row;
            const dCol = destino.col - ficha.col;

            // Solo movimientos en cruz de 2 espacios
            if ((Math.abs(dRow) === 2 && dCol === 0) || (Math.abs(dCol) === 2 && dRow === 0)) {
                const medioRow = ficha.row + dRow / 2;
                const medioCol = ficha.col + dCol / 2;

                // Verificar que haya una ficha en el medio
                if (estado[medioRow][medioCol] === 1) {
                    // Actualizar tablero lógico
                    estado[ficha.row][ficha.col] = 0;
                    estado[medioRow][medioCol] = 0;
                    estado[destino.row][destino.col] = 1;

                    // Eliminar la ficha saltada usando splice
                    for (let i = 0; i < tablero.fichas.length; i++) {
                        const f = tablero.fichas[i];
                        if (f.row === medioRow && f.col === medioCol) {
                            tablero.fichas.splice(i, 1);
                            break;
                        }
                    }
                    // Mover la ficha (fila/col y posición en canvas)
                    ficha.setFilaColumna(destino.row, destino.col);
                    ficha.setPosition(destino.x, destino.y);

                    movimientoValido = true;
                }
            }
        }

        // Si NO fue válido, restauramos la posición guardada en onMouseDown
        if (!movimientoValido) {
            const orig = ficha._originalPos;
            if (orig) {
                ficha.setFilaColumna(orig.row, orig.col);
                ficha.setPosition(orig.x, orig.y);
            }
        }
        // limpiar
        ficha.setResaltado(false);
        this.hints = [];
        this.lastClickedFigure = null;

        this.draw();
    }
}
