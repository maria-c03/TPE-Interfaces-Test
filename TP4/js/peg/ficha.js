class Ficha extends Figura {
    constructor(posX, posY, imagenSrc, radio, onLoadCallback) {
        super(posX, posY, null, null);
        this.radio = radio;
        this.imagen = new Image();
        this.imagen.src = imagenSrc;
        this.loaded = false;

        this.imagen.onload = () => {
            this.loaded = true;
            if (onLoadCallback) onLoadCallback();
        };
    }

    draw(ctx) {
        if (!this.loaded || !this.imagen.complete) return;

        ctx.drawImage(
            this.imagen,
            this.posX - this.radio,
            this.posY - this.radio,
            this.radio * 2,
            this.radio * 2
        );

        if (this.resaltado) {
            ctx.beginPath();
            ctx.arc(this.posX, this.posY, this.radio, 0, 2 * Math.PI);
            ctx.strokeStyle = this.resaltadoEstilo;
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.closePath();
        }
    }

    getRadius() {
        return this.radius;
    }

    isPointInside(x, y) {
        const dx = this.posX - x;
        const dy = this.posY - y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}


