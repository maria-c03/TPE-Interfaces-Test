class Bird {
    constructor() {
        this.x = 300; // Posición inicial en el eje X
        this.y = 350; // Posición inicial en el eje Y
        this.v = 0;   // Velocidad vertical
        this.width = 64;  // Ancho del pájaro
        this.height = 55; // Alto del pájaro
        this.weight = 1;  // Peso para la gravedad
        this.element = document.getElementById("character"); // pajaro en el DOM
    }

    update(game) {
        if (this.y > game.canvas.height - this.height) {
            this.y = game.canvas.height - this.height;
            this.v = 0;
        } else {
            this.v += this.weight;
            this.v *= 0.9;
            this.y += this.v;
        }

        if (this.y < 0 + this.height) {
            this.y = this.height;
            this.v = 0;
        }

        if (game.spacepressed) {
            this.flap();
        }

        this.element.style.top = `${this.y}px`;
    }

    flap() {
        this.v -= 8; // Cuando se presiona espacio el pajaro sube
    }

    hide() {
        // oculto el pajaro para que se vea bien la explosion
        this.element.style.opacity = '0';
    }

}
