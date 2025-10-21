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
        this.pieces = []; //array con todas las piezas del puzzle.
        this.selectedImageSrc = null;
        this.imageActual = new Image(); //imagen que contendrá la versión con filtro
        this.imageOriginal = null;

        // Thumbnails UI state
        this.hoveredThumbIndex = null; // índice del thumbnail bajo el cursor
        this.selectedThumbIndex = null; // thumbnail seleccionado por el usuario
        this.animationInterval = null;
        this.animationHighlightIndex = null; // índice actualmente resaltado por la animación
        this.pendingSelectionIndex = null; // índice para iniciar animación una vez que se muestre 'jugando'

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
                src: src,
                area: { x: thumbX, y: thumbY, width: 100, height: 100 }
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
            const shuffled = indexes.slice().sort(() => Math.random() - 0.8);
            sequence.push(...shuffled);
        }
        // Aseguro que el último sea el target
        sequence.push(targetIndex);

        let seqPos = 0;
        this.animationHighlightIndex = sequence[0];
        this.drawUI();

        this.animationInterval = setInterval(() => {
            seqPos++;
            if (seqPos >= sequence.length) {
                // fin de animación
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.animationHighlightIndex = null;
                this.selectionAnimating = false;
                this.selectedThumbIndex = targetIndex;
                this.selectedImageSrc = this.thumbnails[targetIndex].src;
                this.drawUI();
                Promise.resolve().then(() => onComplete && onComplete()).catch(e => console.error(e));
                return;
            }
            this.animationHighlightIndex = sequence[seqPos];
            this.drawUI();
        }, 120); // 120ms por paso -> animación rápida
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
            // Si hay un tiempo máximo y lo superó, entonces se pierde el nivel
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

                    // Almacenar el área para la detección de clic
                    dif.area = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };

                    // Dibujo el botón
                    this.ctx.fillStyle = "#F72585";
                    this.ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
                    this.ctx.fillStyle = "white";
                    this.ctx.font = "22px Roboto";
                    // Aseguro alineación centrada tanto horizontal como vertical
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    this.ctx.fillText(dif.nombre, btnX + btnWidth / 2, btnY + btnHeight / 2);
                });
                break;

            case "jugando":
                this.ctx.fillStyle = "#000000";
                this.ctx.fillRect(0, 0, this.width, this.height);

                // Dibujo thumbnails (seleccionables)
                this.thumbnails.forEach((thumb, i) => {
                    // imagen base
                    this.ctx.drawImage(thumb.image, thumb.x, thumb.y, thumb.width, thumb.height);

                    // decidir si dibujar borde: animating highlight o seleccionado
                    const isAnimating = this.animationHighlightIndex === i;
                    const isSelected = this.selectedThumbIndex === i;

                    if (isAnimating) {
                        // borde amarillo brillante durante la animación
                        this.ctx.strokeStyle = "#FFD166";
                        this.ctx.lineWidth = 6;
                        this.ctx.strokeRect(thumb.x - 4, thumb.y - 4, thumb.width + 8, thumb.height + 8);
                    } else if (isSelected) {
                        // borde permanente indicando selección
                        this.ctx.strokeStyle = "#4ADE80"; // verde claro
                        this.ctx.lineWidth = 4;
                        this.ctx.strokeRect(thumb.x - 2, thumb.y - 2, thumb.width + 4, thumb.height + 4);
                    }
                });

                this.drawTimer();

                // Si hay una selección pendiente (viene de elegir dificultad o "Jugar de nuevo"),
                // iniciar la animación ahora que la UI 'jugando' es visible.
                if (this.pendingSelectionIndex !== null) {
                    const target = this.pendingSelectionIndex;
                    this.pendingSelectionIndex = null; // evitar reinicios
                    this.startThumbnailSelectionAnimation(target, () => {
                        // cuando termina la animación, iniciar el juego con la miniatura seleccionada
                        this.startGame();
                    });
                }

                // Si el nivel es difícil, mostrar botón de ayudita
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
                for (let i = 0; i < this.thumbnails.length; i++) {
                    const t = this.thumbnails[i];
                    const a = t.area;
                    if (a && mouseX >= a.x && mouseX <= a.x + a.width && mouseY >= a.y && mouseY <= a.y + a.height) {
                        // Iniciar animación que terminará en la miniatura i (pero no empezar el juego todavía)
                        this.startThumbnailSelectionAnimation(i);
                        return;
                    }
                }

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

                        // Seleccionar aleatoriamente una miniatura pero esperar a que la UI muestre 'jugando' para animar
                        const randomIndex = Math.floor(Math.random() * this.thumbnails.length);
                        this.pendingSelectionIndex = randomIndex;
                        this.gameState = "jugando";
                        this.drawUI();
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
                            //reinicio el estado antes de empezar otra partida
                            this.lost = false;
                            this.time = 0;
                            // Volver a seleccionar aleatoriamente una miniatura pero ejecutar la animación
                            // una vez que la pantalla 'jugando' esté visible
                            const randomIndex = Math.floor(Math.random() * this.thumbnails.length);
                            this.pendingSelectionIndex = randomIndex;
                            this.gameState = "jugando";
                            this.drawUI();
                            return;

                        } else if (btn.text === "Elegir dificultad") {
                            this.time = 0;
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