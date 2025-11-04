class PegController {
    constructor(pegModel, pegVista) {
        this.tablero = pegModel;
        this.vista = pegVista;
        this.vista.setController(this); // La vista reporta eventos a este controlador

        this.gameState = "inicio";
        this.isMouseDown = false;
        this.lastClickedFigure = null;
        this.fichaOriginalPos = null;

        this.timeLimit = 120;
        this.remainingTime = 0;
        this.timerInterval = null;
        this.recordTime = null;

        this.vista.setGameState(this.gameState);
        this.vista.crearBotones();
        this.vista.draw();
    }

    handleButtonClick(boton) {
        switch (this.gameState) {
            case "inicio":
                this.setGameState("bienvenida");
                break;

            case "bienvenida":
                if (boton.text === "Comenzar") {
                    this.setGameState("jugando");
                }
                break;

            case "jugando":
                if (boton.text === "Fichas") {
                    this.setGameState("seleccionFichas");
                } else if (boton.text === "Reiniciar") {

                    this.reiniciarJuego();
                    this.vista.hints = [];
                    this.lastClickedFigure = null;
                } else if (boton.text === "Menu") {
                    window.location.reload();
                } else if (boton.text === "Instrucciones") {
                    this.vista.toggleInstructions();
                }
                break;

            case "seleccionFichas":
                const imgFicha = this.vista.imagenesFichas.find(f =>
                    boton.isClicked(f.x + f.size / 2, f.y + f.size / 2)
                );

                if (imgFicha) {
                    this.cambiarFichas(imgFicha.src);
                }
                break;

            case "fin":
                if (boton.text === "Reiniciar") {
                    this.reiniciarJuego();
                    this.iniciarTimer(); 
                    this.setGameState("jugando");
                } else if (boton.text === "Menu") {
                    window.location.reload();
                    return;
                }
                break;
        }
        this.vista.crearBotones();
        this.vista.draw();
    }

    setGameState(newState) {
        this.gameState = newState;
        this.vista.setGameState(newState);

        if (newState !== "jugando") {
            this.detenerTimer();
        }
    }

    iniciarTimer() {
        if (this.timerInterval) return;

        if (this.remainingTime == null || this.remainingTime <= 0) {
            this.remainingTime = this.timeLimit;
        }
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.vista.setRemainingTime(this.remainingTime);
            if (this.remainingTime <= 0) {
                this.remainingTime = 0;
                clearInterval(this.timerInterval);
                this.mostrarFinDeJuego("¡Se acabó el tiempo!");
            }
            this.vista.draw();
        }, 1000);
    }

    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    mostrarFinDeJuego(mensaje, gano = false) {
        this.detenerTimer();
        this.vista.setFinMensaje(mensaje);
        this.gano = gano;
        this.setGameState("fin");
        this.vista.crearBotones(this.gano);
        this.vista.draw();
    }

    reiniciarJuego() {
        this.tablero.reiniciar();
        this.remainingTime = this.timeLimit;
        this.vista.hints = [];
        this.lastClickedFigure = null;
        this.setGameState("jugando");
        this.vista.crearBotones();
        this.vista.draw();
    }

    cambiarFichas(src) {
        this.detenerTimer();
        this.tablero.actualizarTipoFicha(src);

        this.tablero.reiniciar();
        this.remainingTime = this.timeLimit;

        this.vista.hints = [];
        this.lastClickedFigure = null;

        this.tablero.llenarTableroConHueco(3, 3);
        this.iniciarTimer();
        this.setGameState("jugando");
        this.vista.crearBotones();
        this.vista.draw();
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

    calcularHints(ficha) {
        const hints = [];
        const estado = this.tablero.getEstado();
        const posiciones = this.tablero.generarPosicionesCruz(); 

        const direcciones = [
            { dRow: -2, dCol: 0 }, { dRow: 2, dCol: 0 },
            { dRow: 0, dCol: -2 }, { dRow: 0, dCol: 2 }
        ];

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
                const pos = posiciones.find(p => p.row === destinoRow && p.col === destinoCol);
                if (pos) hints.push(pos);
            }
        }
        this.vista.hints = hints; 
    }

    moverFicha(ficha, mouseX, mouseY) {
        const tablero = this.tablero;
        const estado = tablero.getEstado();
        const posiciones = tablero.generarPosicionesCruz();
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

            if ((Math.abs(dRow) === 2 && dCol === 0) || (Math.abs(dCol) === 2 && dRow === 0)) {
                const medioRow = ficha.row + dRow / 2;
                const medioCol = ficha.col + dCol / 2;

                if (estado[medioRow][medioCol] === 1) {
                    estado[ficha.row][ficha.col] = 0;
                    estado[medioRow][medioCol] = 0;
                    estado[destino.row][destino.col] = 1;

                    for (let i = 0; i < tablero.fichas.length; i++) {
                        const f = tablero.fichas[i];
                        if (f.row === medioRow && f.col === medioCol) {
                            tablero.fichas.splice(i, 1);
                            break;
                        }
                    }

                    ficha.setFilaColumna(destino.row, destino.col);
                    ficha.setPosition(destino.x, destino.y);

                    movimientoValido = true;
                }
            }
        }

        if (!movimientoValido && this.fichaOriginalPos) {
            ficha.setFilaColumna(this.fichaOriginalPos.row, this.fichaOriginalPos.col);
            ficha.setPosition(this.fichaOriginalPos.x, this.fichaOriginalPos.y);
        }

        ficha.setResaltado(false);
    }

    tieneMovimientosValidos() {
        const estado = this.tablero.getEstado();
        const fichas = this.tablero.getFichas();

        const direcciones = [
            { dRow: -2, dCol: 0 }, { dRow: 2, dCol: 0 },
            { dRow: 0, dCol: -2 }, { dRow: 0, dCol: 2 }
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
                    return true;
                }
            }
        }
        return false;
    }

    finJuego() {
        const fichasRestantes = this.tablero.getFichas();

        if (fichasRestantes.length === 1) {
            const ultima = fichasRestantes[0];
            if (ultima.row === 3 && ultima.col === 3) {
                this.detenerTimer();
                const tiempoJuego = this.timeLimit - this.remainingTime;
                let mensaje = `¡Ganaste en ${tiempoJuego}s!`;

                if (!this.recordTime || tiempoJuego < this.recordTime) {
                    this.recordTime = tiempoJuego;
                }
                this.mostrarFinDeJuego(mensaje, true);
                return;
            }
        }

        if (!this.tieneMovimientosValidos()) {
            this.detenerTimer();
            this.mostrarFinDeJuego("¡Perdiste! no quedan movimientos validos", false);
        }
    }

    handleMouseDown(mouseX, mouseY) {
        this.isMouseDown = true;
        const botonClickeado = this.vista.botones.find(b => b.isClicked(mouseX, mouseY));

        if (botonClickeado) {
            this.handleButtonClick(botonClickeado);
            return;
        }

        if (this.gameState === "seleccionFichas") {
            for (let f of this.vista.imagenesFichas) {
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

        if (this.gameState === "jugando" && this.tablero.tipoFicha) {
            if (this.lastClickedFigure) {
                this.lastClickedFigure.setResaltado(false);
                this.vista.hints = [];
                this.lastClickedFigure = null;
            }

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
            }
            this.vista.draw();
        }
    }

    handleMouseMove(mouseX, mouseY) {
        if (!this.isMouseDown || !this.lastClickedFigure) return;
        this.lastClickedFigure.setPosition(mouseX, mouseY);
        this.vista.draw();
    }

    handleMouseUp(mouseX, mouseY) {
        this.isMouseDown = false;
        if (!this.lastClickedFigure) return;

        this.moverFicha(this.lastClickedFigure, mouseX, mouseY);

        this.vista.hints = [];
        this.lastClickedFigure = null;
        this.fichaOriginalPos = null;

        this.vista.draw();
        this.finJuego();
    }
}