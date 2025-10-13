"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let playBtn = "Jugar";


    const images = [
        "img/imgBlocka/image1.png",
        "img/imgBlocka/image2.jpg",
        "img/imgBlocka/image3.jpg",
        "img/imgBlocka/image4.jpg",
        "img/imgBlocka/image5.jpg",
        "img/imgBlocka/image6.jpg"
    ];

    const thumbnails = [];
    let pieces = [];
    let image1 = new Image();
    let selectedImage = null;
    let gameStarted = false;
    let time = 0;
    let timerInterval = null;

    const cols = 2;
    const rows = 2;
    const posStartX = 660;
    const posStartY = 350;

    // Cargar thumbnails
    images.forEach((src, index) => {
        const thumb = new Image();
        thumb.src = src;
        const thumbX = 450 + index * 110;
        const thumbY = 150;
        thumbnails.push({
            image: thumb,
            x: thumbX,
            y: thumbY,
            width: 100,
            height: 100,
            src: src
        });
    });

    // Dibujar botón JUGAR
    const playButton = {
        x: 650,
        y: 600,
        width: 200,
        height: 50
    };

    function drawUI() {
        // Fondo
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // miniaturas
        thumbnails.forEach((thumb) => {
            ctx.drawImage(thumb.image, thumb.x, thumb.y, thumb.width, thumb.height);
        });
        if (!gameStarted) {
            // boton jugar
            ctx.fillStyle = "#4444ff";
            ctx.fillRect(playButton.x, playButton.y, playButton.width, playButton.height);
            ctx.fillStyle = "white";
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.fillText(playBtn, playButton.x + playButton.width / 2, playButton.y + 30);
        }


        // Tiempo en pantalla
        ctx.fillStyle = "white";
        ctx.font = "16px Roboto";
        ctx.textAlign = "left";
        ctx.fillText(`Tiempo: ${time}s`, 700, 80);
    }

    function getRandomRotation() {
        const rotations = [0, 90, 180, 270];
        return rotations[Math.floor(Math.random() * rotations.length)];
    }

    function isPuzzleSolved() {
        return pieces.every(piece => piece.rotation === 0);
    }

    function drawPuzzle() {
        drawUI();

        if (!selectedImage) return;

        pieces.forEach(piece => {
            ctx.save();
            const centerX = piece.canvasX + piece.width / 2;
            const centerY = piece.canvasY + piece.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.drawImage(
                image1,
                piece.sourceX,
                piece.sourceY,
                piece.sourceWidth,
                piece.sourceHeight,
                -piece.width / 2,
                -piece.height / 2,
                piece.width,
                piece.height
            );
            ctx.restore();
        });

        // Si está resuelto, detener el tiempo
        if (isPuzzleSolved()) {
            clearInterval(timerInterval);
            gameStarted = false;
            playBtn = "Jugar de nuevo";

            // Mensaje sobre el puzzle
            ctx.fillStyle = "lime";
            ctx.font = "30px Roboto";
            ctx.textAlign = "center";
            ctx.fillText("¡Puzzle resuelto!", 750, 320);

            // Dibujar botón sobre el puzzle sin borrar nada
            ctx.fillStyle = "#4444ff";
            ctx.fillRect(playButton.x, playButton.y, playButton.width, playButton.height);
            ctx.fillStyle = "white";
            ctx.font = "18px Arial";
            ctx.fillText(playBtn, playButton.x + playButton.width / 2, playButton.y + 30);
        }

    }

    function startGame() {
        if (!selectedImage) return;

        pieces = [];
        image1 = new Image();
        image1.src = selectedImage;

        image1.onload = function () {
            const pieceWidth = image1.width / cols;
            const pieceHeight = image1.height / rows;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const canvasX = posStartX + x * pieceWidth;
                    const canvasY = posStartY + y * pieceHeight;

                    pieces.push({
                        sourceX: x * pieceWidth,
                        sourceY: y * pieceHeight,
                        sourceWidth: pieceWidth,
                        sourceHeight: pieceHeight,
                        width: pieceWidth,
                        height: pieceHeight,
                        canvasX,
                        canvasY,
                        rotation: getRandomRotation()
                    });
                }
            }

            gameStarted = true;
            time = 0;

            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                time++;
                drawPuzzle();
            }, 1000);

            drawPuzzle();
        };
        playBtn = "Jugar de nuevo";
    }

    canvas.addEventListener("mousedown", function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Clic en botón "Jugar"
        if (
            mouseX >= playButton.x && mouseX <= playButton.x + playButton.width &&
            mouseY >= playButton.y && mouseY <= playButton.y + playButton.height
        ) {
            // Seleccionar imagen aleatoria
            const randomIndex = Math.floor(Math.random() * thumbnails.length);
            selectedImage = thumbnails[randomIndex].src;
            startGame();
            return;
        }

        if (!gameStarted) return;

        // Clic en pieza
        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            if (
                mouseX >= piece.canvasX &&
                mouseX <= piece.canvasX + piece.width &&
                mouseY >= piece.canvasY &&
                mouseY <= piece.canvasY + piece.height
            ) {
                // Botón izquierdo → -90°, derecho → +90°
                if (event.button === 0) {
                    piece.rotation = (piece.rotation - 90 + 360) % 360;
                } else if (event.button === 2) {
                    piece.rotation = (piece.rotation + 90) % 360;
                }
                drawPuzzle();
                break;
            }
        }
    });

    // Prevenir menú contextual en canvas
    canvas.addEventListener("contextmenu", event => event.preventDefault());

    // Primer dibujo inicial (UI sin puzzle aún)
    drawUI();
});
