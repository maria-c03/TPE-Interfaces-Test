"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    //array con la ruta de las imagenes del juego
    const images = [
        "img/imgBlocka/image1.png",
        "img/imgBlocka/image2.jpg",
        "img/imgBlocka/image3.jpg",
        "img/imgBlocka/image4.jpg",
        "img/imgBlocka/image5.jpg",
        "img/imgBlocka/image6.jpg"
    ];
    //--- botón jugar ---
    let playBtn = "Jugar de nuevo";
    const playButton = {
        x: 731,
        y: 325,
        width: 100,
        height: 100
    };

    const playAgain = {
        x: 680,
        y: 600,
        width: 200,
        height: 50
    };

    const thumbnails = [];
    let pieces = [];
    let selectedImage = null;
    let imageActual = new Image();
    let gameStarted = false;
    let time = 0;
    let timerInterval = null;
    //cantidad de partes del puzle si quiero 4 cols=2, para 6 cols=3, para 8 cols=4
    const cols = 2;
    const rows = 2;
    //posicion donde se dibujara la img del puzzle en el canvas
    const posStartX = 680;
    const posStartY = 350;

    // Carga de miniaturas 
    images.forEach((src, index) => {
        //por cada ruta se crea un image() y se fija un src
        const thumb = new Image();
        thumb.src = src;
        // calculo la posicion de la miniatura, separada por 110px 
        const thumbX = 450 + index * 110;
        const thumbY = 150;
        //añado un objeto con la miniatura y su posicion al array thumbnails
        thumbnails.push({
            image: thumb,
            x: thumbX,
            y: thumbY,
            width: 100,
            height: 100,
            src: src
        });
    });

    // --- interfaz de usuario ---
    function drawUI() {
        // Fondo del canva
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // dibujo las miniaturas
        thumbnails.forEach((thumb) => {
            ctx.drawImage(thumb.image, thumb.x, thumb.y, thumb.width, thumb.height);
        });
        //si el juego no esta activo, dibujo el boton de jugar
        if (!gameStarted) {
            drawBtnPlayStart();
        }
        //muestro el tiempo de juego
        drawTimer();
    }

    // --- logica ---

    //devuelvo una rotacion aleatoria
    function getRandomRotation() {
        //angulos
        const rotations = (Math.floor(Math.random() * 4) * 90);
        return rotations;
    }
    //si todas las piezas tienen rotacion 0 devuelve true
    function isPuzzleSolved() {
        return pieces.every(piece => piece.rotation === 0);
    }

    function drawPuzzle() {
        //dibujo la interfaz de usuario
        drawUI();
        //si no hay imagen seleccionada no dibujo piezas
        if (!selectedImage) return;

        pieces.forEach(piece => {
            //por cada pieza calculo el centro de la pieza en canvas
            const centerX = piece.canvasX + piece.width / 2;
            const centerY = piece.canvasY + piece.height / 2;
            //guardo el estado del contexto
            ctx.save();
            //muevo el origen al centro de la pieza
            ctx.translate(centerX, centerY);
            //roto el contexto según piece.rotation
            ctx.rotate(piece.rotation * Math.PI / 180);

            // Primero dibuja la pieza
            ctx.drawImage(
                imageActual, //imagen base
                piece.sourceX,
                piece.sourceY, //posición de la parte dentro de la imagen original
                piece.sourceWidth,
                piece.sourceHeight, //tamaño de esa parte.
                -piece.width / 2,
                -piece.height / 2, //posición en el canvas, centrada en el origen
                piece.width,
                piece.height //tamaño con que se dibuja.
            );
            // Luego aplica el filtro sobre la región ya dibujada
            aplicarFiltro(ctx, piece.canvasX, piece.canvasY, piece.width, piece.height);
            console.log("pX: " + piece.sourceX, "pY: " + piece.sourceY);
            //vuelvo al estado original del contexto (antes de translate/rotate).
            ctx.restore();
        });//cada pieza aparece en su posición con rotación propia

        // Si está resuelto, detener el tiempo
        if (isPuzzleSolved()) {
            showMenssage();
        }
    }

    // --- funciones ---
    function drawBtnPlayStart() {
        // circulo
        ctx.beginPath();
        const centerX = playButton.x + playButton.width / 2;
        const centerY = playButton.y + playButton.height / 2;
        const radius = Math.min(playButton.width, playButton.height) / 2;

        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#F72585";
        ctx.fill();

        // --- Triángulo ---
        ctx.beginPath();
        ctx.lineJoin = "round";   // une las líneas con un borde redondeado
        ctx.lineCap = "round";    // redondea los extremos de cada línea
        // vértices del triángulo
        const size = radius * 0.4; // proporción del tamaño del triángulo
        ctx.moveTo(centerX - size / 2, centerY - size / 1.5); // punta superior izquierda
        ctx.lineTo(centerX - size / 2, centerY + size / 1.5); // punta inferior izquierda
        ctx.lineTo(centerX + size / 1.5, centerY); // punta derecha
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 6; // el grosor da suavidad
        ctx.stroke();
        ctx.fill();
    }
    function drawBtnPlay() {
        // boton volver a jugar
        ctx.fillStyle = "#F72585";
        ctx.fillRect(playAgain.x, playAgain.y, playAgain.width, playAgain.height);
        ctx.fillStyle = "white";
        ctx.font = "18px Roboto";
        ctx.textAlign = "center";
        ctx.fillText(playBtn, playAgain.x + playAgain.width / 2, playAgain.y + 30);
    }

    function drawTimer() {
        // tiempo en pantalla
        ctx.fillStyle = "white";
        ctx.font = "16px Roboto";
        ctx.textAlign = "left";
        ctx.fillText(`Tiempo: ${time}s`, 731, 80);
    }

    function showMenssage() {
        // mensaje en pantalla
        clearInterval(timerInterval); //detiene el contador por segundos.
        gameStarted = false; //marco que termino el juego
       
        ctx.fillStyle = "lime";
        ctx.font = "30px Roboto";
        ctx.textAlign = "center";
        ctx.fillText("¡Puzzle resuelto!", 775, 320);
        //pinto el boton jugar de nuevo 
        drawBtnPlay();
    }

    function startGame() {
        if (!selectedImage) return; // si no selecciono una imagen no hago nada

        pieces = [];
        imageActual = new Image();
        imageActual.src = selectedImage;

        imageActual.onload = function () {
            //calculo el ancho y alto de cada pieza
            const pieceWidth = imageActual.width / cols;
            const pieceHeight = imageActual.height / rows;
            //recorro filas y columnas
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const canvasX = posStartX + x * pieceWidth;
                    const canvasY = posStartY + y * pieceHeight;
                    //por cada celda agrego un objeto pieza con sus coordenadas, tamaño, posicion en el canvas y rotacion.
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
            //marco el inicio del juego en true y reseteo el tiempo en cero
            gameStarted = true;
            time = 0;
            //si ya habia un timerInterval lo limpio
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            //creo un nuevo timerInterval
            timerInterval = setInterval(() => {
                time++; //incremento el tiempo
                drawPuzzle(); // vuelvo a dibujar el puzzle
            }, 1000);
            //llamo a drawPuzzle para mostrar el estado inicial 
            drawPuzzle();
        };
        //coloco el boton jugar de nuevo
        playBtn = "Jugar de nuevo";
    }

    // --- eventos ---

    //Calcula las coordenadas del click respecto al canvas (mouseX, mouseY) usando getBoundingClientRect().
    canvas.addEventListener("mousedown", function (event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // si el click cae dentro de las coordenadas de playButton
        if ((mouseX >= playButton.x) && (mouseX <= playButton.x + playButton.width) &&
            (mouseY >= playButton.y) && (mouseY <= playButton.y + playButton.height)) {
            // Seleccionar imagen aleatoria e inicializo el juego
            const randomIndex = Math.floor(Math.random() * thumbnails.length);
            selectedImage = thumbnails[randomIndex].src;
            startGame();
            return;
        }else if ((mouseX >= playAgain.x) && (mouseX <= playAgain.x + playAgain.width) &&
            (mouseY >= playAgain.y) && (mouseY <= playAgain.y + playAgain.height)) {
            // Seleccionar imagen aleatoria e inicializo el juego
            const randomIndex = Math.floor(Math.random() * thumbnails.length);
            selectedImage = thumbnails[randomIndex].src;
            startGame();
            return;
        }

        // Clic en una pieza
        for (const piece of pieces) {
            //recorro las piezas y si el click cae dentro de la caja canvasX..canvasX+width y canvasY..canvasY+height, entonces
            if ((mouseX >= piece.canvasX) && (mouseX <= piece.canvasX + piece.width) &&
                (mouseY >= piece.canvasY) && (mouseY <= piece.canvasY + piece.height)) {

                if (event.button === 0) { // Botón izquierdo → rota la pieza -90°
                    piece.rotation = (piece.rotation - 90 + 360) % 360; //asegura que la rotación quede en el rango 0..359
                } else if (event.button === 2) { //derecho → rota la pieza 90°
                    piece.rotation = (piece.rotation + 90) % 360;
                }
                drawPuzzle(); //actualizo la pantalla con la nueva rotacion
                break;
            }
        }
    });

    // Evito el menú contextual en canvas al hacer clic derecho
    canvas.addEventListener("contextmenu", event => event.preventDefault());

    // inicializacion, al cargar la página se dibuja la interfaz inicial (miniaturas, botón Jugar y tiempo en 0)
    drawUI();



    //       function aplicarFiltro(ctx, iniX, iniY, w, h) {
    //         const imageData = ctx.getImageData(iniX,iniY, w, h);
    //         const data = imageData.data;
    //             for (let i = 0; i < data.length; i += 4) {
    //             data[i] = 255 - data[i];
    //             data[i + 1] = 255 - data[i + 1];
    //             data[i + 2] = 255 - data[i + 2];
    //             }
    //         ctx.putImageData(imageData, iniX, iniY);
    //   }



    // Aplica el filtro importado sobre la región de la pieza
    function aplicarFiltro(ctx, iniX, iniY, w, h) {
        // Selecciona aleatoriamente uno de los filtros importados
        const filtros = [filtroBrillo, filtroGrices, filtroNegativo];
        const filtro = filtros[Math.floor(Math.random() * filtros.length)];
        filtro(ctx, iniX, iniY, w, h);
    }

});
