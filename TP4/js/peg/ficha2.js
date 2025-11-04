
class Ficha extends Figura {

    constructor(posX, posY, imagenSrc, radio, onLoadCallback) {
        // Llamar al constructor de la clase padre (Figura)
        super(posX, posY, null, null);
        
        this.radio = radio; // Radio del círculo de la ficha
        
        // Cargar imagen de la ficha (personaje)
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.loaded = false; // Flag para saber si la imagen ya cargó
        
        // Event handler cuando la imagen termina de cargar
        this.imagen.onload = () => {
            this.loaded = true;
            if (onLoadCallback) onLoadCallback(); // Ejecutar callback si existe
        };
    }


    setFilaColumna(row, col) {
        this.row = row;
        this.col = col;
    }

    draw(ctx) {
        if (!this.loaded || !this.imagen.complete) return;
        // Dibujar la imagen centrada en la posición de la ficha
        // La imagen se dibuja desde (posX - radio, posY - radio) 
        // con tamaño (radio*2, radio*2) para que esté centrada
        ctx.drawImage(
            this.imagen,
            this.posX - this.radio, // X superior izquierda
            this.posY - this.radio, // Y superior izquierda
            this.radio * 2,         // Ancho (diámetro)
            this.radio * 2          // Alto (diámetro)
        );
        
    }

    getDiameter() {
        return this.radio * 2;
    }

    getRadius() {
        return this.radio;
    }

    isPointInside(x, y) {
        const dx = this.posX - x; 
        const dy = this.posY - y; 
    
        return Math.sqrt(dx * dx + dy * dy) < this.radio;
    }
}
