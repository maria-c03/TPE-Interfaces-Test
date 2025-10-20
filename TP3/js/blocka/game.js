class PuzzleGame {
    constructor(canvasId) {
        //Referencias al canvas, su contexto 2D y dimensiones
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.filtros = new Filtros(this.ctx);
        this.gameState = "inicio"; // "inicio" | "menuDificultad" | "jugando" | "fin"
        this.time = 0;
        this.timerInterval = null;
        this.cols = 2;
        this.rows = 2;
        this.posStartX = 680; //Posición en el canvas donde se dibujan las piezas
        this.posStartY = 350;

        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/imgJuegos/marvel_blocka.png";

        this.maxTime = null; // Tiempo máximo permitido (solo en difícil)
        this.lost = false;   // Indica si el jugador perdió

        this.imageSources = [
            "img/imgBlocka/image1.png", "img/imgBlocka/image2.jpg", "img/imgBlocka/image3.jpg",
            "img/imgBlocka/image4.jpg", "img/imgBlocka/image5.jpg", "img/imgBlocka/image6.jpg"
        ];
        this.thumbnails = []; //array donde se crean objetos thumbnail con posición en UI.
        this.pieces = []; //array con todas las piezas del puzzle
        this.selectedImageSrc = null;
        this.imageActual = new Image(); //imagen que contendrá la versión con filtro
        this.imageOriginal = null;

        this.playButton = new Button(731, 325, 100, 100, "", "circle");
        this.finishButtons = []; // Almacena los botones de fin de juego
        this.helpButton = new Button(728, 280, 100, 40, "Ayudita", "rect");

        this.dificultades = [
            { nombre: "Fácil", cols: 2, rows: 2, area: null },
            { nombre: "Medio", cols: 3, rows: 2, area: null },
            { nombre: "Difícil", cols: 4, rows: 2, area: null }
        ];

        this.loadThumbnails();
        this.setupEventListeners();
        this.drawUI(); // Inicia el dibujo
    }

    // --- Carga de recursos y configuración ---

    loadThumbnails() {
        this.imageSources.forEach((src, index) => {
            const thumb = new Image();
            thumb.src = src;
            const thumbX = 450 + index * 110;
            const thumbY = 150;
            this.thumbnails.push({
                image: thumb,
                x: thumbX,
                y: thumbY,
                width: 100,
                height: 100,
                src: src
            });
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.onCanvasClick.bind(this));
        this.canvas.addEventListener("contextmenu", event => event.preventDefault()); //evita el menú contextual del click derecho.
        this.backgroundImage.onload = () => this.drawUI(); //redibujo cuando la imagen de fondo carga.
    }

    // --- Lógica del juego ---

    isPuzzleSolved() {
        return this.pieces.every(piece => piece.rotation === 0);
    }

    createPieces() {
        this.pieces = [];
        const pieceWidth = this.imageActual.width / this.cols;
        const pieceHeight = this.imageActual.height / this.rows;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const canvasX = this.posStartX + x * pieceWidth;
                const canvasY = this.posStartY + y * pieceHeight;

                this.pieces.push(new PuzzlePiece(
                    x * pieceWidth,
                    y * pieceHeight,
                    pieceWidth,
                    pieceHeight,
                    pieceWidth, // width en canvas
                    pieceHeight, // height en canvas
                    canvasX,
                    canvasY
                ));
            }
        }
        this.startTimer();
        this.gameState = "jugando";
        this.drawPuzzle();
    }

    startTimer() {
        this.time = 0;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            this.time++;
            // Si hay un tiempo máximo y lo superó → pierde
            if (this.maxTime && this.time >= this.maxTime) {
                this.loseGame();
                return;
            }
            this.drawPuzzle();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    startGame() {
        if (!this.selectedImageSrc) return;

        const imgTemp = new Image();
        imgTemp.src = this.selectedImageSrc;

        imgTemp.onload = () => {
            this.imageOriginal = imgTemp;

            // Creamos un canvas temporal
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = imgTemp.width;
            tempCanvas.height = imgTemp.height;
            tempCtx.drawImage(imgTemp, 0, 0);

            this.filtros.ctx = tempCtx;

            const filtros = [
                this.filtros.brillo.bind(this.filtros, 0, 0, imgTemp.width, imgTemp.height),
                this.filtros.grices.bind(this.filtros, 0, 0, imgTemp.width, imgTemp.height),
                this.filtros.negativo.bind(this.filtros, 0, 0, imgTemp.width, imgTemp.height),
                this.filtros.sepia.bind(this.filtros, 0, 0, imgTemp.width, imgTemp.height),
            ];
            const filtroElegido = filtros[Math.floor(Math.random() * filtros.length)];
            filtroElegido();
            // Volvemos a asignar el contexto original al objeto filtros para cualquier uso posterior
            this.filtros.ctx = this.ctx;
            // Sobreescribimos imageActual con la versión filtrada
            this.imageActual.src = tempCanvas.toDataURL();

            this.imageActual.onload = () => {
                this.createPieces();
            };
        };
    }
    loseGame() {
        this.stopTimer();
        this.lost = true;
        this.gameState = "fin";

        // Mostrar pantalla de derrota
        this.drawUI();
    }

    // --- Dibujo ---

    drawUI() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        switch (this.gameState) {
            case "inicio":
                if (this.backgroundImage.complete) {
                    this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
                } else {
                    this.ctx.fillStyle = "#000000";
                    this.ctx.fillRect(0, 0, this.width, this.height);
                }
                this.playButton.draw(this.ctx);
                break;

            case "menuDificultad":
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = "white";
                this.ctx.font = "28px Roboto";
                this.ctx.textAlign = "center";
                this.ctx.fillText("Selecciona la dificultad", this.width / 2, 180);

                this.dificultades.forEach((dif, index) => {
                    const btnX = this.width / 2 - 100;
                    const btnY = 250 + index * 100;
                    const btnWidth = 200;
                    const btnHeight = 60;

                    // Almacenar el área para la detección de clic
                    dif.area = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };

                    // Dibujo el botón
                    this.ctx.fillStyle = "#F72585";
                    this.ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
                    this.ctx.fillStyle = "white";
                    this.ctx.font = "22px Roboto";
                    this.ctx.fillText(dif.nombre, this.width / 2, btnY + 38);
                });
                break;

            case "jugando":
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);

                this.thumbnails.forEach((thumb) => {
                    this.ctx.drawImage(thumb.image, thumb.x, thumb.y, thumb.width, thumb.height);
                });
                this.drawTimer();

                // 🔹 Si el nivel es difícil, mostrar botón de ayudita
                if (this.cols >= 3 && this.rows >= 2) {
                    this.helpButton.draw(this.ctx);
                }

                break;

            case "fin":
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);

                this.ctx.font = "30px Roboto";
                this.ctx.textAlign = "center";

                if (this.lost) {
                    this.ctx.fillStyle = "#F72585";
                    this.ctx.fillText("¡Tiempo agotado! Perdiste el nivel.", 770, 280);
                } else {
                    this.ctx.fillStyle = "lime";
                    this.ctx.fillText("¡Puzzle resuelto!", 770, 280);
                }

                // Muestro la imagen original
                const pieceWidth = this.imageActual.width / this.cols;
                const pieceHeight = this.imageActual.height / this.rows;
                const totalPuzzleWidth = pieceWidth * this.cols;
                const totalPuzzleHeight = pieceHeight * this.rows;
                this.ctx.drawImage(this.imageOriginal, this.posStartX, this.posStartY, totalPuzzleWidth, totalPuzzleHeight);

                this.finishButtons.forEach(btn => btn.draw(this.ctx));
                break;
        }
    }

    drawPuzzle() {
        if (this.gameState !== "jugando") return;
        this.drawUI();

        if (!this.selectedImageSrc) return;

        this.pieces.forEach(piece => {
            piece.draw(this.ctx, this.imageActual);
        });

        if (this.isPuzzleSolved()) {
            this.showMenssage();
        }
    }

    drawTimer() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Roboto";
        this.ctx.textAlign = "left";
        if (this.maxTime) { //tiempo restante
            const remaining = Math.max(0, this.maxTime - this.time);
            this.ctx.fillText(`Tiempo: ${remaining}s`, 731, 80);
        } else { //tiempo transcurrido
            this.ctx.fillText(`Tiempo: ${this.time}s`, 731, 80);
        }
    }

    showMenssage() {
        this.stopTimer();
        this.gameState = "fin";

        const btnRepetir = new Button(570, 600, 200, 60, "Jugar de nuevo", "rect");
        const btnMenu = new Button(790, 600, 200, 60, "Elegir dificultad", "rect");

        this.finishButtons = [btnRepetir, btnMenu];

        this.drawUI();
    }

    giveHelp() {
        // Si ya hay una pieza fija, no permitir otra ayudita
        const alreadyHelped = this.pieces.some(p => p.fixed);
        if (alreadyHelped) return;

        // Elegir una pieza aleatoria
        const randomIndex = Math.floor(Math.random() * this.pieces.length);
        const piece = this.pieces[randomIndex];

        // Colocar la pieza correctamente
        piece.rotation = 0;
        piece.fixed = true;

        // Penalizar con +5 segundos
        this.time += 5;

        this.drawPuzzle();
    }


    // --- Manejo de eventos ---

    onCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        switch (this.gameState) {
            case "inicio":
                if (this.playButton.isClicked(mouseX, mouseY)) {
                    this.gameState = "menuDificultad";
                    this.drawUI();
                }
                break;

            case "menuDificultad":
                for (const dif of this.dificultades) {
                    const a = dif.area;
                    if (a && mouseX >= a.x && mouseX <= a.x + a.width && mouseY >= a.y && mouseY <= a.y + a.height) {
                        this.cols = dif.cols;
                        this.rows = dif.rows;

                        if (dif.nombre === "Difícil") {
                            this.maxTime = 20;
                        } else {
                            this.maxTime = null; // Sin límite en otros niveles
                        }
                        this.lost = false;

                        const randomIndex = Math.floor(Math.random() * this.thumbnails.length);
                        this.selectedImageSrc = this.thumbnails[randomIndex].src;

                        this.startGame();
                        return;
                    }
                }
                break;

            case "jugando":
                if (this.cols >= 3 && this.rows >= 2 && this.helpButton.isClicked(mouseX, mouseY)) {
                    this.giveHelp();
                    return; // Evita que también se intente rotar una pieza
                }
                for (const piece of this.pieces) {
                    if (piece.fixed) continue; //evito rotar piezas fijas
                    if (piece.isClicked(mouseX, mouseY)) {
                        piece.rotate(event.button === 0 ? -1 : 1); // Izquierda (-1) o derecha (1)
                        this.drawPuzzle();
                        break;
                    }
                }
                break;

            case "fin":
                for (const btn of this.finishButtons) {
                    if (btn.isClicked(mouseX, mouseY)) {
                        if (btn.text === "Jugar de nuevo") {
                            // Selecciono una imagen aleatoria diferente
                            let newIndex;
                            do {
                                newIndex = Math.floor(Math.random() * this.thumbnails.length);
                            } while (this.thumbnails[newIndex].src === this.selectedImageSrc && this.thumbnails.length > 1);

                            this.selectedImageSrc = this.thumbnails[newIndex].src;
                            this.startGame();
                        } else if (btn.text === "Elegir dificultad") {
                            this.gameState = "menuDificultad";
                            this.drawUI();
                        }
                        return;
                    }
                }
                break;
        }
    }
}

// --- Inicialización del juego ---

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const filtros = new Filtros(ctx);

    filtros.brillo(0, 0, canvas.width, canvas.height);
    filtros.sepia(0, 0, canvas.width, canvas.height);
    filtros.negativo(0, 0, canvas.width, canvas.height);
    filtros.grices(0, 0, canvas.width, canvas.height);

    // Crear instancia del juego
    const game = new PuzzleGame("canvas");
});