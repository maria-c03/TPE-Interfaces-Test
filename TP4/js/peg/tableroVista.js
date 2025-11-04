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
        this.fichaOriginalPos = null; // guarda {x, y, row, col} temporalmente
        this.showInstructions = false;
        // Estado del juego
        this.gameState = "inicio"; // "inicio" | "bienvenida" | "jugando" | "fin" | "seleccionFichas"
        this.finMensaje = "";

        // Imágenes de fichas
        this.imagenesFichas = [
            { src: "img/imgPeg/homer2.png", img: new Image()},
            { src: "img/imgPeg/lissa2.png", img: new Image()},
            { src: "img/imgPeg/marge.png", img: new Image() },
            { src: "img/imgPeg/bart2.png", img: new Image() }
        ];
        this.imagenesFichas.forEach(f => f.img.src = f.src);

        // Botones
        this.botones = [];
        this.crearBotones();

        // Fondo inicio
        this.backgroundImageInicio = new Image();
        this.backgroundImageInicio.src = "img/imgJuegos/re_peg-solitarie.png";
        this.backgroundImageInicio.onload = () => this.draw();

        // Temporizador
        this.timeLimit = 120;
        this.remainingTime = 0;
        this.timerInterval = null;
        this.recordTime = null;

        // Eventos
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

        requestAnimationFrame(() => this.animateHints());
    }

    // Crear botones según estado
    crearBotones() {
        this.botones = [];
        if (this.gameState === "inicio") {
            this.botones.push(new Button(731, 325, 100, 100, "", "circle"));
        } else if (this.gameState === "bienvenida") {
            this.botones.push(new Button(680, 400, 200, 60, "Comenzar", "rect"));
        } else if (this.gameState === "jugando") {
            this.botones.push(new Button(125, 100, 170, 60, "Instrucciones", "rect"));
            this.botones.push(new Button(1340, 280, 120, 60, "Fichas", "rect"));
            this.botones.push(new Button(1340, 360, 120, 60, "Reiniciar", "rect"));
            this.botones.push(new Button(1340, 440, 120, 60, "Menu", "rect"));
        } else if (this.gameState === "fin") {
            this.botones.push(new Button(620, 450, 140, 60, "Menu", "rect"));
            this.botones.push(new Button(790, 450, 140, 60, "Reiniciar", "rect"));
        }
    }

    // Dibuja toda la UI según el estado
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.gameState) {
            case "inicio":
                if (this.backgroundImageInicio.complete) {
                    ctx.drawImage(this.backgroundImageInicio, 0, 0, this.canvas.width, this.canvas.height);
                }
                this.botones.forEach(b => b.draw(ctx));
                break;

            case "seleccionFichas":
                ctx.fillStyle = "rgba(48, 60, 106, 0.95)";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                ctx.fillStyle = "white";
                ctx.font = "bold 36px Arial";
                ctx.textAlign = "center";
                ctx.fillText("Selecciona un personaje", this.canvas.width / 2, 220);

                const startX = 400;
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
                break;

            case "bienvenida":
                // Fondo semitransparente
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Cuadro central
                const modalWidth = 500;
                const modalHeight = 250;
                const modalX = (this.canvas.width - modalWidth) / 2;
                const modalY = (this.canvas.height - modalHeight) / 2;

                ctx.fillStyle = "rgba(48, 60, 106, 0.95)";
                ctx.fillRect(modalX, modalY, modalWidth, modalHeight);

                // Borde
                ctx.strokeStyle = "#FFD166";
                ctx.lineWidth = 4;
                ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);

                // Texto
                ctx.fillStyle = "white";
                ctx.font = "bold 36px Arial";
                ctx.textAlign = "center";
                ctx.fillText("¡Bienvenido!", this.canvas.width / 2, modalY + 60);

                ctx.font = "24px Arial";
                ctx.fillText("¿Estas listo para el desafio?", this.canvas.width / 2, modalY + 120);

                // Botón de comenzar
                this.botones.forEach(b => b.draw(ctx));
                break;

            case "jugando":
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

                if (this.showInstructions) {
                    const instrX = 50;
                    const instrY = 170;
                    const instrWidth = 320;
                    const instrHeight = 500;
                    this.ctx.fillStyle = "rgba(129, 48, 103, 0.8)";
                    this.ctx.fillRect(instrX, instrY, instrWidth, instrHeight);
                    // Borde
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeStyle = "#FFD166"; // color del borde (amarillo)
                    this.ctx.strokeRect(instrX, instrY, instrWidth, instrHeight);

                    this.ctx.fillStyle = "white";
                    this.ctx.font = "26px Roboto";
                    this.ctx.textAlign = "left";
                    this.ctx.fillText("Instrucciones:", instrX + 7, instrY + 30);

                    this.ctx.font = "20px Roboto";
                    const lineHeight = 31;
                    const instructions = [
                        "Haz click en la casilla de Fichas",
                        "Selecciona una para comenzar",
                        "la partida",
                        "",
                        "Juego: ",
                        "Haz y manten click sobre una ficha",
                        "Salta con esta sobre otra pero",
                        "¡Cuidado! solo puedes saltar si",
                        "hay un espacio vacio",
                        "Las flechas te ayudaran a ver",
                        "movimientos permitidos",
                        "Repite el salto hasta que",
                        "quede sola una. Pero recuerda,",
                        "solo ganas si queda en el centro",
                    ];

                    instructions.forEach((text, i) => {
                        this.ctx.fillText(text, instrX + 7, instrY + 65 + i * lineHeight);
                    });
                }

                // Fichas
                const fichas = this.tablero.getFichas();
                fichas.forEach(ficha => {
                    if (ficha !== this.lastClickedFigure) {
                        ficha.draw(ctx);
                    }
                });
                if (this.lastClickedFigure) {
                    this.lastClickedFigure.draw(ctx);
                }

                // Hints
                if (this.hints.length > 0) {
                    this.drawHints(ctx);
                }

                // Botones
                this.botones.forEach(b => b.draw(ctx));

                // Temporizador
                this.drawTimer();
                break;

            case "fin":
                // Fondo semi-transparente
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Mensaje
                ctx.fillStyle = "#fff";
                ctx.font = "48px Arial";
                ctx.textAlign = "center";
                ctx.fillText(this.finMensaje, this.canvas.width / 2, 375);

                // Botones
                this.botones.forEach(b => b.draw(ctx));
                break;
        }
    }

    // --- Timer ---
    drawTimer() {
        this.ctx.font = "30px Roboto";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Tiempo: ${this.remainingTime}s`, 1300, 100);
    }

    iniciarTimer() {
        this.remainingTime = this.timeLimit;
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            if (this.remainingTime <= 0) {
                this.remainingTime = 0;
                clearInterval(this.timerInterval);
                this.mostrarFinDeJuego("¡Se acabó el tiempo!");
            }
            this.draw();
        }, 1000);
    }

    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    mostrarFinDeJuego(mensaje) {
        this.detenerTimer();
        this.finMensaje = mensaje;
        this.gameState = "fin";
        this.crearBotones();
        this.draw();
    }

    reiniciarJuego() {
        this.tablero.reiniciar();
        this.remainingTime = this.timeLimit;
        this.gameState = "jugando";
        this.crearBotones();
        this.iniciarTimer();
        this.draw();
    }

    handleButtonClick(boton) {
        switch (this.gameState) {
            case "inicio":
                this.gameState = "bienvenida";
                this.crearBotones();
                this.draw();
                break;

            case "bienvenida":
                if (boton.text === "Comenzar") {
                    this.gameState = "jugando";
                    this.crearBotones();
                    this.draw();
                }
                break;

            case "jugando":
                if (boton.text === "Fichas") {
                    // Pasar a selección de fichas
                    this.gameState = "seleccionFichas";
                    this.crearBotones();
                    this.draw();
                } else if (boton.text === "Reiniciar") {
                    // Reiniciar tablero
                    this.tablero.reiniciar();

                    // Esperar que las fichas se carguen antes de dibujar
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
                } else if (boton.text === "Menu") {
                    window.location.reload(); // recarga toda la página
                } else {
                    this.showInstructions = !this.showInstructions; // alterno la visibilidad
                    this.draw();
                }
                break;

            case "seleccionFichas":
                // Verifico si se clickeó alguna imagen de ficha
                for (let f of this.imagenesFichas) {
                    if (
                        boton.x >= f.x && boton.x <= f.x + f.size &&
                        boton.y >= f.y && boton.y <= f.y + f.size
                    ) {
                        this.cambiarFichas(f.src);
                        break;
                    }
                }
                break;

            case "fin":
                if (boton.text === "Reiniciar") {
                    this.reiniciarJuego();
                } else if (boton.text === "Menu") {
                    window.location.reload();
                }
                break;
        }
    }
    //--------------------------------------------------------------------------------------------------------------------

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
        this.iniciarTimer();
        this.draw();
    }


    tieneMovimientosValidos() {
        const estado = this.tablero.getEstado();
        const fichas = this.tablero.getFichas();

        const direcciones = [
            { dRow: -2, dCol: 0 },
            { dRow: 2, dCol: 0 },
            { dRow: 0, dCol: -2 },
            { dRow: 0, dCol: 2 }
        ];

        for (let ficha of fichas) {
            for (let dir of direcciones) {
                const destinoRow = ficha.row + dir.dRow;
                const destinoCol = ficha.col + dir.dCol;
                const medioRow = ficha.row + dir.dRow / 2;
                const medioCol = ficha.col + dir.dCol / 2;

                if (
                    destinoRow >= 0 && destinoRow < 7 &&
                    destinoCol >= 0 && destinoCol < 7 &&
                    estado[medioRow][medioCol] === 1 &&
                    estado[destinoRow][destinoCol] === 0
                ) {
                    return true; // Hay al menos un movimiento válido
                }
            }
        }
        return false; // Ningún movimiento válido
    }


    // ------Eventos--------
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // --- verifico si se hizo click en un boton ---
        for (let b of this.botones) {
            if (b.isClicked(mouseX, mouseY)) {
                this.handleButtonClick(b);
                return;
            }
        }

        // verifico si se hizo click en una ficha (Homer, Lissa o Bart)
        if (this.gameState === "seleccionFichas") {
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

        // --- si se eligio ficha y estamos jugando---
        if (this.gameState === "jugando" && this.tablero.tipoFicha) {
            // Si el tablero está vacío, llenarlo
            if (this.tablero.getFichas().length === 0) {
                this.tablero.llenarTableroConHueco(3, 3); // siempre en el centro
                this.draw();
                return;
            }
            // seleccionar una ficha si se clickeo
            this.seleccionarFicha(mouseX, mouseY);
        }
    }

    seleccionarFicha(mouseX, mouseY) {
        if (this.lastClickedFigure) {
            this.lastClickedFigure.setResaltado(false);
            this.hints = [];
            this.lastClickedFigure = null;
        }
        // resaltar ficha
        const clickFicha = this.findClickedFigure(mouseX, mouseY);
        if (clickFicha) {
            clickFicha.setResaltado(true);
            this.lastClickedFigure = clickFicha;
            this.fichaOriginalPos = {
                x: clickFicha.posX,
                y: clickFicha.posY,
                row: clickFicha.row,
                col: clickFicha.col
            };
            this.calcularHints(clickFicha);
            this.isMouseDown = true;
        }
        this.draw();
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

        this.moverFicha(ficha, mouseX, mouseY);
        //limpio los estados despues de mover la ficha
        this.hints = [];
        this.lastClickedFigure = null;
        this.fichaOriginalPos = null;

        this.draw();
        this.finJuego();
    }

    moverFicha(ficha, mouseX, mouseY) {
        const tablero = this.tablero;
        const estado = tablero.getEstado();

        // busco la posición mas cercana
        const posiciones = this.generarPosicionesCruz();
        let destino = null;
        let minDist = Infinity; //inicializo minDist con un valor muy grande para luego compararlo con distancias reales y encontrar la menor

        posiciones.forEach(pos => {
            //calculo la distancia de cada posicion al clic del mouse.
            const dx = pos.x - mouseX;
            const dy = pos.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy); //distancia desde el clic hasta esa posicion
            if (dist < minDist) {
                minDist = dist; //guarda la distancia mas pequeña
                destino = pos; //la primera distancia que calculo siempre sera menor, asi me aseguro que destino se inicializa correctamente
            }
        });

        let movimientoValido = false;

        if (destino && estado[destino.row][destino.col] === 0) {
            const dRow = destino.row - ficha.row;
            const dCol = destino.col - ficha.col;

            // Solo movimientos en cruz de 2 espacios
            //Math.abs(dRow) devuelve el valor absoluto de la fila o columna, el cual siempre sera positivo!
            if ((Math.abs(dRow) === 2 && dCol === 0) || (Math.abs(dCol) === 2 && dRow === 0)) {
                //Math.abs(dRow) === 2 significa que el movimiento vertical es de exactamente 2 filas, sin importar si es hacia arriba o hacia abajo
                const medioRow = ficha.row + dRow / 2;
                const medioCol = ficha.col + dCol / 2;

                // si hay una ficha en el medio
                if (estado[medioRow][medioCol] === 1) {
                    // Actualizar tablero lógico
                    estado[ficha.row][ficha.col] = 0;     //el origen queda vacio
                    estado[medioRow][medioCol] = 0;       //se elimina la ficha intermedia
                    estado[destino.row][destino.col] = 1; //se actualiza destino

                    // se elimina del array la ficha saltada usando splice
                    for (let i = 0; i < tablero.fichas.length; i++) {
                        const f = tablero.fichas[i];
                        if (f.row === medioRow && f.col === medioCol) {
                            tablero.fichas.splice(i, 1);
                            break;
                        }
                    }
                    // actualizo la posicion logica y visual de la ficha(fila/col y posición en canvas)
                    ficha.setFilaColumna(destino.row, destino.col);
                    ficha.setPosition(destino.x, destino.y);

                    movimientoValido = true;
                }
            }
        }
        // si el movimiento no es valido la ficha vuelve a su posición original
        if (!movimientoValido) {
            if (this.fichaOriginalPos) {
                ficha.setFilaColumna(this.fichaOriginalPos.row, this.fichaOriginalPos.col);
                ficha.setPosition(this.fichaOriginalPos.x, this.fichaOriginalPos.y);
            }
        }
        // limpiar
        ficha.setResaltado(false);
    }

    finJuego() {
        // --- VERIFICACIÓN DE VICTORIA ---
        const fichasRestantes = this.tablero.getFichas();
        if (fichasRestantes.length === 1) {
            const ultima = fichasRestantes[0];
            // asumimos posición inicial fila 3, col 3
            if (ultima.row === 3 && ultima.col === 3) {
                this.detenerTimer();
                const tiempoJuego = this.timeLimit - this.remainingTime;
                let mensaje = `¡Ganaste en ${tiempoJuego}s!`;

                if (!this.recordTime || tiempoJuego < this.recordTime) {
                    this.recordTime = tiempoJuego;
                    mensaje += " ¡Nuevo récord!";
                }
                this.mostrarFinDeJuego(mensaje);
                return;
            }
        }
        // --- VERIFICACIÓN DE DERROTA ---
        if (!this.tieneMovimientosValidos()) {
            this.detenerTimer();
            this.mostrarFinDeJuego("¡Perdiste! no quedan movimientos validos");
        }
    }
}
