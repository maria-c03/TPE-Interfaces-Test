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
        this.fixed = false;
    }

    // devuelve una rotación aleatoria (0, 90, 180, 270 grados)
    getRandomRotation() {
        return (Math.floor(Math.random() * 4) * 90);
    }

    // dibuja la pieza en el contexto del canvas con su rotación
    draw(ctx, imageActual) {
        //punto medio de la pieza en coordenadas del canvas
        const centerX = this.canvasX + this.width / 2;
        const centerY = this.canvasY + this.height / 2;

        ctx.save(); //guardo el estado del contexto para no afectar a otros dibujos

        ctx.beginPath();
        ctx.rect(this.canvasX, this.canvasY, this.width, this.height);
        ctx.clip(); //todo fuera de este rectangulo queda recortado (asi evito que se vea que gira el rectangulo)

        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation * Math.PI / 180); //convierte rotation de grados a radianes porque rotate usa radianes

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
        //restauro las transformaciones y estilos previos para no afectar otros dibujos
        ctx.restore();
    }

    rotate(direction) {
        if (this.fixed) return; //si esta fija no permito que se rote
        if (direction === -1) { // direction: -1 sentido antihorario, 1 sentido horario
            this.rotation = (this.rotation - 90 + 360) % 360; //se usa el %360 para evitar negativos
        } else {
            this.rotation = (this.rotation + 90) % 360;
        }
    }

    // verifico que se hizo un click en la pieza
    isClicked(mouseX, mouseY) {
        return (
            mouseX >= this.canvasX && mouseX <= this.canvasX + this.width &&
            mouseY >= this.canvasY && mouseY <= this.canvasY + this.height
        );
    }
}