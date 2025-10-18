"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const backgroundImage = new Image();
    backgroundImage.src = "img/imgJuegos/marvel_blocka.png";

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
    const button = {
        x: 731,
        y: 325,
        width: 100,
        height: 100,
        shape: "circle",
        text: "Jugar de nuevo"
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

    // --------- INTERFAZ DE USUARIO ----------
    function drawUI() {
        //si el juego no esta activo, dibujo la imagen de fondo y el boton de jugar
        if (!gameStarted) {
            // Si la imagen de fondo ya cargó
            if (backgroundImage.complete) {
                ctx.drawImage(backgroundImage, 0, 0, width, height);
            } else {
                // Si todavía no cargó, pintamos un fondo negro mientras tanto
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, width, height);
                // Cuando la imagen termine de cargar, redibujamos automáticamente
                backgroundImage.onload = () => drawUI();
            }
            drawButton();
            return;
        }
        // Fondo del canva
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // dibujo las miniaturas
        thumbnails.forEach((thumb) => {
            ctx.drawImage(thumb.image, thumb.x, thumb.y, thumb.width, thumb.height);
        });
        //muestro el tiempo de juego
        drawTimer();
    }

    // --------- FUNCIONES LOGICA Y DIBUJO ---------

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
            //vuelvo al estado original del contexto (antes de translate/rotate).
            ctx.restore();
        });//cada pieza aparece en su posición con rotación propia

        // Si está resuelto, detener el tiempo
        if (isPuzzleSolved()) {
            showMenssage();
        }
    }

    function drawButton() {
        // circulo
        if (button.shape === "circle") {
            ctx.beginPath();
            const centerX = button.x + button.width / 2;
            const centerY = button.y + button.height / 2;
            const radius = Math.min(button.width, button.height) / 2;

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
        } else if (button.shape === "rect") {
            // boton volver a jugar
            ctx.fillStyle = "#F72585";
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "white";
            ctx.font = "18px Roboto";
            ctx.textAlign = "center";
            ctx.fillText(button.text, button.x + button.width / 2, button.y + 30);
        }
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

        // Cambiar botón a rectángulo
        button.shape = "rect";
        button.x = 680;
        button.y = 600;
        button.width = 200;
        button.height = 50;

        drawButton();
    }

    // -------------PIEZAS--------------

    function createPice() {
        pieces = [];
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

    }

    // -------------INICIO JUEGO--------------

    function startGame() {
        if (!selectedImage) return; // si no selecciono una imagen no hago nada

        imageActual = new Image();
        imageActual.src = selectedImage;

        imageActual.onload = function () {
            // Aplicar filtro aleatorio a la imagen completa antes de cortar piezas
            const filtros = [filtroBrillo, filtroGrices, filtroNegativo];
            const filtroElegido = filtros[Math.floor(Math.random() * filtros.length)];

            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = imageActual.width;
            tempCanvas.height = imageActual.height;

            tempCtx.drawImage(imageActual, 0, 0);
            filtroElegido(tempCtx, 0, 0, imageActual.width, imageActual.height);

            // Sobreescribimos imageActual con la versión filtrada
            imageActual.src = tempCanvas.toDataURL();

            imageActual.onload = function () {
                createPice();
            };
        };

    }

    // -------------FUNCIONALIDAD CLICK----------------

    function onCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // --- Si el juego está activo: solo se permite rotar piezas ---
        if (gameStarted) {
            for (const piece of pieces) {
                if (
                    mouseX >= piece.canvasX && mouseX <= piece.canvasX + piece.width &&
                    mouseY >= piece.canvasY && mouseY <= piece.canvasY + piece.height
                ) {
                    if (event.button === 0) {
                        piece.rotation = (piece.rotation - 90 + 360) % 360;
                    } else if (event.button === 2) {
                        piece.rotation = (piece.rotation + 90) % 360;
                    }
                    drawPuzzle();
                    break;
                }
            }
            return; //Evita que se ejecute el resto del código
        }

        // --- Si el juego NO está activo: solo se permite clic al botón ---
        let clicked = false;
        if (button.shape === "circle") {
            const centerX = button.x + button.width / 2;
            const centerY = button.y + button.height / 2;
            const radius = Math.min(button.width, button.height) / 2;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            clicked = dx * dx + dy * dy <= radius * radius;
        } else if (button.shape === "rect") {
            clicked =
                mouseX >= button.x && mouseX <= button.x + button.width &&
                mouseY >= button.y && mouseY <= button.y + button.height;
        }

        if (clicked) {
            // Selecciona imagen aleatoria e inicia el juego
            const randomIndex = Math.floor(Math.random() * thumbnails.length);
            selectedImage = thumbnails[randomIndex].src;
            startGame();
        }
    }
    // -----------------EVENTOS---------------------
    canvas.addEventListener("mousedown", onCanvasClick);
    // Evito el menú contextual en canvas al hacer clic derecho
    canvas.addEventListener("contextmenu", event => event.preventDefault());

    // -----------------FILTROS-----------------------

    function filtroBrillo(ctx, iniX, iniY, w, h) {

        const imageData = ctx.getImageData(iniX, iniY, w, h);
        const data = imageData.data;

        // aplicamos un 70 de reducion de color en cada uno de los valores

        for (let i = 0; i < data.length; i += 4) {
            // Ajustar cada componente de color (R, G, B)
            data[i] = data[i] * 0.3;     // Rojo
            data[i + 1] = data[i + 1] * 0.3; // Verde
            data[i + 2] = data[i + 2] * 0.3;
        }

        ctx.putImageData(imageData, iniX, iniY);

    }

    function filtroSepia(ctx, iniX, iniY, w, h) {
        const imageData = ctx.getImageData(iniX, iniY, w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length - 1; i += 4) {

            const rojo = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            //Calculo para tono sepia (Internet) supuestos valores.
            const sepiaRed = ((rojo * 0.393) + (green * 0.769) + (blue * 0.189));
            const sepiaGreen = ((rojo * 0.349) + (green * 0.686) + (blue * 0.168));
            const sepiaBlue = ((rojo * 0.272) + (green * 0.534) + (blue * 0.131));

            // Agrego tono por pixel para filtro sepia
            data[i] = sepiaRed;
            data[i + 1] = sepiaGreen;
            data[i + 2] = sepiaBlue;
        }
        ctx.putImageData(imageData, iniX, iniY);
    }

    function filtroNegativo(ctx, iniX, iniY, w, h) {
        const imageData = ctx.getImageData(iniX, iniY, w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length - 1; i += 4) {

            // Invertimos valores para dar negativo (maximo posible - valor)= valor invertido.
            const red = data[i] = 255 - data[i];
            const green = data[i + 1] = 255 - data[i + 1];
            const blue = data[i + 2] = 255 - data[i + 2];

            //Asignamos valores.
            data[i] = red;
            data[i + 1] = green;
            data[i + 2] = blue;
        }
        ctx.putImageData(imageData, iniX, iniY);
    }


    function filtroGrices(ctx, iniX, iniY, w, h) {

        const imageData = ctx.getImageData(iniX, iniY, w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length - 1; i += 4) {

            // Segun BT.601 calculamos los grices para mas espefiquidad
            const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
        }

        ctx.putImageData(imageData, iniX, iniY);
    }

    // inicializacion, al cargar la página se dibuja la interfaz inicial (miniaturas, botón Jugar y tiempo en 0)
    drawUI();
});
