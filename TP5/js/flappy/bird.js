class Bird {
    constructor() {
        this.x = 300; 
        this.y = 350; 
        this.v = 0;   // velocidad vertical
        this.width = 64;  
        this.height = 55; 
        this.weight = 1;  //gravedad
        this.element = document.getElementById("character"); 
    }

    update(game) {
        this.v += this.weight;
        this.v *= 0.9;
        this.y += this.v;
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
