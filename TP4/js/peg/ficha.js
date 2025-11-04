
// Ficha = circulo = tipo de Figura.
class Ficha extends Figura {
    constructor(posX, posY, imagenSrc, radio, onLoadCallback) {
        super(posX, posY, null, null);
        this.radio = radio;

        this.resaltado = false; 
        this.resaltadoEstilo = "#F72585"; 

        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.loaded = false;

        this.imagen.onload = () => {
            this.loaded = true;
            if (onLoadCallback) onLoadCallback();
        };
    }

    setFilaColumna(row,col){
        this.row = row;
        this.col = col;
    }

    draw(ctx) {
        // la imagen debe estar cargada. de lo contrario no la dibujo
        if (!this.loaded || !this.imagen.complete) return;

        ctx.drawImage(
            this.imagen,
            this.posX - this.radio,
            this.posY - this.radio,
            this.radio*2,
            this.radio*2
        );

        if (this.resaltado) {
            const radioResaltado = this.radio;
            ctx.beginPath();
            ctx.arc(this.posX, this.posY, this.getDiameter(), 0, 2 * Math.PI);
            ctx.strokeStyle = this.resaltadoEstilo;
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.closePath();
        }
    }
    // Método para activar/desactivar el resaltado
    setResaltado(resaltar) {
        this.resaltado = resaltar;
    }

    getDiameter(){
        return this.radius * 2;
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