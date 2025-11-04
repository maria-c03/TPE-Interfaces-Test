class PegVista {
    constructor(canvasId, pegModel) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.tablero = pegModel;
        this.controller = null;

        this.canvas.style.backgroundColor = "rgba(0,0,0,1)";

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.hints = [];
        this.animAngle = 0;
        this.showInstructions = false;
        this.remainingTime = 0;

        this.gameState = "inicio"; // "inicio" | "bienvenida" | "jugando" | "fin" | "seleccionFichas"
        this.finMensaje = "";

        this.imagenesFichas = [
            { src: "img/imgPeg/homer2.png", img: new Image() },
            { src: "img/imgPeg/lissa2.png", img: new Image() },
            { src: "img/imgPeg/marge.png", img: new Image() },
            { src: "img/imgPeg/bart2.png", img: new Image() }
        ];
        this.imagenesFichas.forEach(f => f.img.src = f.src);

        this.botones = [];

        this.backgroundImageInicio = new Image();
        this.backgroundImageInicio.src = "img/imgJuegos/re_peg-solitarie.png";
        this.backgroundImageInicio.onload = () => this.draw();

        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));

        requestAnimationFrame(() => this.animateHints());
    }

    setController(controller) {
        this.controller = controller;
    }

    setGameState(state) {
        this.gameState = state;
    }

    setFinMensaje(mensaje) {
        this.finMensaje = mensaje;
    }

    setRemainingTime(time) {
        this.remainingTime = time;
    }

    toggleInstructions() {
        this.showInstructions = !this.showInstructions;
    }

    getDraggedFicha() {
        return this.controller ? this.controller.lastClickedFigure : null;
    }

    crearBotones(gano = false) {
        this.botones = [];
        if (this.gameState === "inicio") {
            this.botones.push(new Button(731, 325, 100, 100, "", "circle"));
        } else if (this.gameState === "bienvenida") {
            this.botones.push(new Button(680, 400, 200, 60, "Comenzar", "rect"));
        } else if (this.gameState === "jugando") {
            this.botones.push(new Button(40, 100, 180, 60, "Instrucciones", "rect"));
            this.botones.push(new Button(1340, 280, 120, 60, "Fichas", "rect"));
            this.botones.push(new Button(1340, 360, 120, 60, "Reiniciar", "rect"));
            this.botones.push(new Button(1340, 440, 120, 60, "Menu", "rect"));
        } else if (this.gameState === "fin") {
            if (gano) {
                this.botones.push(new Button(700, 450, 140, 60, "Menu", "rect"));

            } else {
                this.botones.push(new Button(620, 450, 140, 60, "Menu", "rect"));
                this.botones.push(new Button(790, 450, 140, 60, "Reiniciar", "rect"));
            }
        }
    }

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
                break;

            case "bienvenida":
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                const modalWidth = 500;
                const modalHeight = 250;
                const modalX = (this.canvas.width - modalWidth) / 2;
                const modalY = (this.canvas.height - modalHeight) / 2;

                ctx.fillStyle = "rgba(48, 60, 106, 0.95)";
                ctx.fillRect(modalX, modalY, modalWidth, modalHeight);

                ctx.strokeStyle = "#FFD166";
                ctx.lineWidth = 4;
                ctx.strokeRect(modalX, modalY, modalWidth, modalHeight);

                ctx.fillStyle = "white";
                ctx.font = "bold 36px Arial";
                ctx.textAlign = "center";
                ctx.fillText("¡Bienvenido!", this.canvas.width / 2, modalY + 60);

                ctx.font = "24px Arial";
                ctx.fillText("¿Estas listo para el desafio?", this.canvas.width / 2, modalY + 120);

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
                this.drawInstructions(ctx);

                const draggedFicha = this.getDraggedFicha();
                const fichas = this.tablero.getFichas();
                fichas.forEach(ficha => {
                    if (ficha !== draggedFicha) {
                        ficha.draw(ctx);
                    }
                });
                if (draggedFicha) {
                    draggedFicha.draw(ctx);
                }

                this.drawHints(ctx); 
                this.botones.forEach(b => b.draw(ctx));
                this.drawTimer(ctx);
                break;

            case "fin":
                ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                ctx.fillStyle = "#fff";
                ctx.font = "48px Arial";
                ctx.textAlign = "center";
                ctx.fillText(this.finMensaje, this.canvas.width / 2, 375);

                this.botones.forEach(b => b.draw(ctx));
                break;
        }
    }

    drawTimer() {
        this.ctx.font = "30px Roboto";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`Tiempo: ${this.remainingTime}s`, 1300, 100);
    }

    drawInstructions(ctx) {
        if (!this.showInstructions) return;

        const instrX = 40;
        const instrY = 170;
        const instrWidth = 350;
        const instrHeight = 560;
        ctx.fillStyle = "rgba(129, 48, 103, 0.8)";
        ctx.fillRect(instrX, instrY, instrWidth, instrHeight);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FFD166";
        ctx.strokeRect(instrX, instrY, instrWidth, instrHeight);

        ctx.fillStyle = "white";
        ctx.font = "26px Roboto";
        ctx.textAlign = "left";
        ctx.fillText("Instrucciones del juego", instrX + 35, instrY + 25);

        ctx.font = "20px Roboto";
        const lineHeight = 31;
        const instructions = [
            "Para iniciar partida: ",
            "Haz click en la casilla de Fichas",
            "Selecciona una ficha para comenzar",
            "a jugar",
            "",
            "Para jugar: ",
            "Haz y manten click sobre una ficha",
            "Salta con esta sobre otra pero",
            "¡Cuidado! solo puedes saltar si",
            "hay un espacio vacio",
            "Las flechas te ayudaran a ver",
            "movimientos permitidos",
            "Repite el salto hasta que",
            "quede sola una. Pero recuerda,",
            "solo ganas si la ultima ficha ",
            "queda en el centro del tablero",

        ];

        instructions.forEach((text, i) => {
            ctx.fillText(text, instrX + 15, instrY + 65 + i * lineHeight);
        });
    }
    drawHints(ctx) {
        const t = (Math.sin(this.animAngle) + 1) / 2;
        ctx.save();
        ctx.strokeStyle = "#F72585";
        ctx.lineWidth = 8;

        this.hints.forEach(pos => {
            const size = 25 + 10 * t;
            const x = pos.x;
            const y = pos.y - 50 - 10 * t;

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

    animateHints() {
        this.animAngle += 0.1;
        if (this.hints.length > 0 || this.gameState === "jugando") this.draw();
        requestAnimationFrame(() => this.animateHints());
    }

    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.controller) {
            this.controller.handleMouseDown(mouseX, mouseY);
        }
    }

    onMouseMove(e) {
        if (!this.controller || !this.controller.isMouseDown || !this.getDraggedFicha()) return;
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.controller.handleMouseMove(mouseX, mouseY);
    }

    onMouseUp(e) {
        if (!this.controller || !this.controller.isMouseDown) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.controller.handleMouseUp(mouseX, mouseY);
    }
}