class PuzzlePiece {
    constructor(sourceX, sourceY, sourceWidth, sourceHeight, pieceWidth, pieceHeight, canvasX, canvasY) {
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.sourceWidth = sourceWidth;
        this.sourceHeight = sourceHeight;
        this.width = pieceWidth;
        this.height = pieceHeight;
        this.canvasX = canvasX;
        this.canvasY = canvasY;
        this.rotation = this.getRandomRotation();
    }

    // Devuelve una rotación aleatoria (0, 90, 180, 270 grados).
    getRandomRotation() {
        return (Math.floor(Math.random() * 4) * 90);
    }

    // Dibuja la pieza en el contexto del canvas con su rotación.
    draw(ctx, imageActual) {
        //punto medio de la pieza en coordenadas del canvas.
        const centerX = this.canvasX + this.width / 2;
        const centerY = this.canvasY + this.height / 2;

        ctx.save(); //Guardo el estado del contexto para no afectar otros dibujos.
        ctx.translate(centerX, centerY); //Traslada el origen de coordenadas del contexto al centro de la pieza. A partir de aquí, dibujar en (0,0) equivale a dibujar en el centro de la pieza.
        ctx.rotate(this.rotation * Math.PI / 180); //Convierte rotation de grados a radianes (Math.PI/180) y rota el contexto.

        //Dibujo la imagen recortada
        ctx.drawImage(
            imageActual,
            this.sourceX,
            this.sourceY,
            this.sourceWidth, 
            this.sourceHeight,// estos primeros parametros especifican la subimagen de la imagen fuente
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height  //son el rectángulo destino en el contexto (x, y, w, h). 
            // Como ya trasladamos al centro, dibujamos la pieza con su esquina superior izquierda en (-width/2, -height/2) para que quede centrada en (0,0).
        );
        //Restauro las transformaciones y estilos previos para que la rotación y la translación no afecten dibujos posteriores.
        ctx.restore();
    }

    // Rota la pieza en 90 grados (sentido horario o antihorario).
    rotate(direction) { // direction: -1 sentido antihorario, 1 sentido horario
        if (direction === -1) {
            this.rotation = (this.rotation - 90 + 360) % 360; //se usa el %360 para evitar negativos
        } else {
            this.rotation = (this.rotation + 90) % 360;
        }
    }

    // Comprueba si un punto (mouseX, mouseY) está dentro del área de la pieza.
    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.canvasX && mouseX <= this.canvasX + this.width &&
            mouseY >= this.canvasY && mouseY <= this.canvasY + this.height
        );
    }
}