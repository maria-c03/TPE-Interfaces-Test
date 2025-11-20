class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.frameCounter = 0; // Contador para ralentizar
        this.frameRate = 8;    // Cambia de frame cada 3 ciclos de animate()
        this.totalFrames = 6; // 6 frames
        this.frameWidth = 32; //ancho de cada frame
        this.frameHeight = 32; //alto del frame
    }

    update() {
        this.frameCounter++;
        if (this.frameCounter % this.frameRate === 0) { // Solo avanza si se cumple el frameRate
            this.frame++;
        }
    }

    draw(ctx, explosionImage) {
        ctx.drawImage(
            explosionImage,
            this.frame * this.frameWidth, 0,
            this.frameWidth, this.frameHeight,
            this.x, this.y,
            70, 70
        );
    }
}
