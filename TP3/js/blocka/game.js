class PuzzleGame {
    constructor(canva) {
        this.canvas = canva;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;


        this.filtros = new Filtros(this.ctx);
        this.gameState = "inicio"; // El estado puede ser "inicio" | "menuDificultad" | "seleccion" | "jugando" | "fin"
        this.time = 0;
        this.timerInterval = null;
        this.cols = 2;
        this.rows = 2;

        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/imgJuegos/marvel_blocka.png";

        this.maxTime = null; // Tiempo máximo permitido (solo en difícil)
        this.lost = false;

        // mejor tiempo por dificultad
        this.bestTimes = {
            "Fácil": null,
            "Medio": null,
            "Difícil": null,
        };
        // nombre de la dificultad actual
        this.currentDifficultyName = "";

        this.puzzleSize = 400;
        this.imageSources = [
            "img/imgBlocka/image1.png", "img/imgBlocka/image2.jpg", "img/imgBlocka/image3.jpg",
            "img/imgBlocka/image4.jpg", "img/imgBlocka/image5.jpg", "img/imgBlocka/image6.jpg"
        ];
        this.thumbnails = []; //array con las miniaturas
        this.pieces = []; //array con todas las piezas del puzzle
        this.selectedImageSrc = null;
        this.imageActual = new Image();
        this.imageOriginal = null;

        this.selectedThumbIndex = null; // thumbnail seleccionado por el usuario
        this.animationInterval = null;
        this.animationIndex = null;; // índice actualmente resaltado por la animación
        this.pendingIndex = null; // índice para iniciar animación una vez que se muestre 'jugando'

        this.playButton = new Button(731, 325, 100, 100, "", "circle");
        this.finishButtons = []; // Almacena los botones de fin de juego
        this.helpButton = new Button(1450, 280, 100, 40, "Ayudita", "rect");
        this.instructionsButton = new Button(1400, 50, 150, 50, "Instrucciones", "rect");
        this.showInstructions = false;

        this.dificultades = [
            { nombre: "Fácil", cols: 2, rows: 2 },
            { nombre: "Medio", cols: 3, rows: 2 },
            { nombre: "Difícil", cols: 4, rows: 2 }
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



    // Inicia una animación que resalta thumbnails en un orden aleatorio/por secuencia y termina en targetIndex
    startThumbnailSelectionAnimation(targetIndex, onComplete) {
        if (this.selectionAnimating) return;
        this.selectionAnimating = true;

        // Generar una secuencia: varias pasadas por todos los índices y terminar en targetIndex
        // _ -> Significa que es una variable que no me importa su contenido
        const indexes = this.thumbnails.map((_, i) => i);
        const sequence = [];
        const passes = 3; // cuántas veces recorrer
        for (let p = 0; p < passes; p++) {
            // mezclo los índices para dar sensación aleatoria
            const shuffled = indexes.slice().sort(() => Math.random() - 0.5);
            sequence.push(...shuffled);
        }
        // Aseguro que el último sea el target
        sequence.push(targetIndex);

        let seqPos = 0;
        this.animationIndex = sequence[0];
        this.drawUI();

        this.animationInterval = setInterval(() => {
            seqPos++;
            if (seqPos >= sequence.length) {
                // fin de animación
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.animationIndex = null;
                this.selectedThumbIndex = targetIndex;
                this.selectedImageSrc = this.thumbnails[targetIndex].src;
                this.selectionAnimating = false;
                this.drawUI();
                setTimeout(() => {
                    this.gameState = "jugando";
                    this.drawUI();
                    Promise.resolve().then(() => onComplete && onComplete()).catch(e => console.error(e));
                }, 1500)
                return;
            }
            this.animationIndex = sequence[seqPos];
            this.drawUI();
        }, 120); // 120ms por paso -> animación rápida
    }

    // --- Lógica del juego ---

    isPuzzleSolved() {
        return this.pieces.every(piece => piece.rotation === 0);
    }

    createPieces() {
        this.pieces = [];

        const pieceWidth = this.puzzleSize / this.cols;
        const pieceHeight = this.puzzleSize / this.rows;

        // posición inicial para centrar el puzzle
        const posStartX = (this.width - this.puzzleSize) / 2;
        const posStartY = (this.height - this.puzzleSize) / 2;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                // coordenadas en el canvas
                const canvasX = posStartX + x * pieceWidth;
                const canvasY = posStartY + y * pieceHeight;

                // coordenadas de la subimagen original
                const sourceWidth = this.imageActual.width / this.cols;
                const sourceHeight = this.imageActual.height / this.rows;
                const sourceX = x * sourceWidth;
                const sourceY = y * sourceHeight;

                this.pieces.push(new PuzzlePiece(
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight,
                    pieceWidth,
                    pieceHeight,
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

            //canvas temporal para la aplicacion de filtros
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
            // Vuelvo a asignar el contexto original al filtro para cualquier uso posterior
            this.filtros.ctx = this.ctx;
            // Sobreescribo imageActual con la versión filtrada
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
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Selecciona la dificultad", this.width / 2, 300);

                this.dificultades.forEach((dif, index) => {
                    const btnWidth = 200;
                    const btnHeight = 60;
                    const spacing = 50; // espacio entre botones
                    const totalWidth = this.dificultades.length * btnWidth + (this.dificultades.length - 1) * spacing;
                    const startX = (this.width - totalWidth) / 2;
                    const btnX = startX + index * (btnWidth + spacing);
                    const btnY = 350;

                    // Dibujo el botón
                    this.ctx.fillStyle = "#F72585";
                    this.ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
                    this.ctx.fillStyle = "white";
                    this.ctx.font = "22px Roboto";
                    // Aseguro alineación centrada tanto horizontal como vertical
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    this.ctx.fillText(dif.nombre, btnX + btnWidth / 2, btnY + btnHeight / 2);

                    dif.btnX = btnX;
                    dif.btnY = btnY;
                    dif.btnWidth = btnWidth;
                    dif.btnHeight = btnHeight;
                });
                break;

            case "seleccion":
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = "white";
                this.ctx.font = "28px Roboto";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Seleccionando la imagen...", this.width / 2, 300);

                // Dibujo thumbnails SOLO EN ESTE ESTADO
                this.thumbnails.forEach((thumb, i) => {
                    this.ctx.drawImage(thumb.image, thumb.x, thumb.y, thumb.width, thumb.height);
                    const isAnimating = this.animationIndex === i;
                    const isSelected = this.selectedThumbIndex === i;

                    if (isAnimating) {
                        this.ctx.strokeStyle = "#F72858";
                        this.ctx.lineWidth = 6;
                        this.ctx.strokeRect(thumb.x - 4, thumb.y - 4, thumb.width + 8, thumb.height + 8);
                    } else if (isSelected) {
                        this.ctx.strokeStyle = "#f2f21eff";
                        this.ctx.lineWidth = 6;
                        this.ctx.strokeRect(thumb.x - 2, thumb.y - 2, thumb.width + 4, thumb.height + 4);
                    }
                });

                // Si hay una selección pendiente, iniciar la animación
                if (this.pendingIndex !== null) {
                    const target = this.pendingIndex;
                    this.pendingIndex = null; // evita reinicios
                    this.startThumbnailSelectionAnimation(target, () => {
                        this.startGame();
                    });
                }
                break;

            case "jugando":
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = "white";
                this.ctx.font = "28px Roboto";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Que comience el juego!", this.width / 2, 80);
                this.drawTimer();

                // Si el nivel es difícil, mostrar botón de ayudita
                if (this.cols >= 3 && this.rows >= 2) {
                    this.helpButton.draw(this.ctx);
                }
                this.instructionsButton.draw(this.ctx);

                // --- panel de Instrucciones  ---
                if (this.showInstructions) {
                    const instrX = 1040;
                    const instrY = 110;
                    const instrWidth = 510;
                    const instrHeight = 150;
                    this.ctx.fillStyle = "rgba(129, 48, 103, 0.8)";
                    this.ctx.fillRect(instrX, instrY, instrWidth, instrHeight);
                    // Borde
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeStyle = "#FFD166"; // color del borde (amarillo)
                    this.ctx.strokeRect(instrX, instrY, instrWidth, instrHeight);

                    this.ctx.fillStyle = "white";
                    this.ctx.font = "26px Roboto";
                    this.ctx.textAlign = "left";
                    this.ctx.fillText("Instrucciones de juego:", instrX + 7, instrY + 30);

                    this.ctx.font = "20px Roboto";
                    const lineHeight = 26;
                    const instructions = [
                        "Clic IZQUIERDO en una pieza para rotarla a la izquierda.",
                        "Clic DERECHO en una pieza para rotarla a la derecha.",
                        "Si el nivel no es facil, usa 'Ayudita' para fijar una pieza."
                    ];

                    instructions.forEach((text, i) => {
                        this.ctx.fillText(text, instrX + 7, instrY + 65 + i * lineHeight);
                    });
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
                    this.ctx.fillText("¡Puzzle resuelto!", 780, 140);
                    this.drawTimer(true);

                    this.ctx.fillStyle = "white";
                    this.ctx.font = "20px Roboto";
                    const bestTime = this.bestTimes[this.currentDifficultyName];
                    const timeText = bestTime ? `Récord: ${bestTime}s` : '¡Nuevo Récord!';
                    this.ctx.fillText(timeText, 1250, 80);
                }

                const centerX = (this.width - this.puzzleSize) / 2;
                const centerY = (this.height - this.puzzleSize) / 2;
                this.ctx.drawImage(this.imageOriginal, centerX, centerY, this.puzzleSize, this.puzzleSize);

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

    drawTimer(isFinal = false) {
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Roboto";
        this.ctx.textAlign = "left";

        if (isFinal) {
            this.ctx.fillText(`Tiempo final: ${this.time}s`, 1250, 120);
        } else if (this.maxTime) { //tiempo restante
            const remaining = Math.max(0, this.maxTime - this.time);
            this.ctx.fillText(`Tiempo: ${remaining}s`, 731, 120);
        } else { //tiempo transcurrido
            this.ctx.fillText(`Tiempo: ${this.time}s`, 731, 120);
        }

        if (!isFinal) {
            this.ctx.font = "20px Roboto";
            this.ctx.fillStyle = "#FFD166";
            const bestTime = this.bestTimes[this.currentDifficultyName];
            const timeText = bestTime ? `Récord: ${bestTime}s` : 'Sin Récord';
            this.ctx.fillText(timeText, 450, 120);
        }
    }

    showMenssage() {
        this.stopTimer();
        const currentBest = this.bestTimes[this.currentDifficultyName];
        if (this.time < currentBest || currentBest === null) {
            this.bestTimes[this.currentDifficultyName] = this.time;
        }
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
        // Recopilo indices de piezas incorrectas
        const incorrectIndices = [];
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].rotation !== 0) {
                incorrectIndices.push(i);
            }
        }
        // entre esas piezas elijo una random
        const randomIndex = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
        const pieceHelp = this.pieces[randomIndex];

        // Coloco la pieza correctamente
        pieceHelp.rotation = 0;
        pieceHelp.fixed = true;

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
                    if (mouseX >= dif.btnX && mouseX <= dif.btnX + dif.btnWidth &&
                        mouseY >= dif.btnY && mouseY <= dif.btnY + dif.btnHeight) {

                        this.cols = dif.cols;
                        this.rows = dif.rows;

                        this.currentDifficultyName = dif.nombre;

                        if (dif.nombre === "Difícil") {
                            this.maxTime = 20;
                        } else {
                            this.maxTime = null; // Sin limite en otros niveles
                        }
                        this.lost = false;

                        // Seleccionar aleatoriamente una miniatura pero esperar a que se muestre 'jugando' para animar
                        const randomIndex = Math.floor(Math.random() * this.thumbnails.length);
                        this.pendingIndex = randomIndex;
                        this.gameState = "seleccion";
                        this.drawUI();
                        return;
                    }
                }
                break;

            case "jugando":
                if (this.instructionsButton.isClicked(mouseX, mouseY)) {
                    this.showInstructions = !this.showInstructions; // alterno la visibilidad
                    this.drawUI();
                    return;
                }

                if (this.cols >= 3 && this.rows >= 2 && this.helpButton.isClicked(mouseX, mouseY)) {
                    this.giveHelp();
                    return;
                }

                for (const piece of this.pieces) {
                    if (piece.fixed) continue; //evito rotar piezas fijas
                    if (piece.isClicked(mouseX, mouseY)) {
                        piece.rotate(event.button === 0 ? -1 : 1);
                        this.drawPuzzle();
                        break;
                    }
                }
                break;

            case "fin":
                for (const btn of this.finishButtons) {
                    if (btn.isClicked(mouseX, mouseY)) {
                        if (btn.text === "Jugar de nuevo") {
                            //debo reiniciar el estado antes de empezar otra partida
                            this.lost = false;
                            this.time = 0;
                            //vuelvo a seleccionar de forma aleatoria una miniatura
                            const randomIndex = Math.floor(Math.random() * this.thumbnails.length);
                            this.pendingIndex = randomIndex;
                            this.gameState = "seleccion";
                            this.drawUI();
                            return;
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
    const canva = document.getElementById("canvas");
    // Crear instancia del juego
    const game = new PuzzleGame(canva);
});