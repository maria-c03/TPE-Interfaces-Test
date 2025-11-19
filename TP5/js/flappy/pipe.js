class Pipe {
    constructor(canvas, bird) {
        this.canvas = canvas;
        this.bird = bird;
        this.top = (Math.random() * canvas.height / 2) + 20;
        this.bottom = (Math.random() * canvas.height / 2) + 20;
        this.x = canvas.width;
        this.width = 100;
        this.color = "#F72585";
        this.counted = false; //bandera para contar el score una sola vez
    }

    update(ctx, canvas, gameSpeed, flappyGame) {
        this.x -= gameSpeed; //muevo la tuberia hacia la izquierda en funcion a la velocidad del juego

        if (!this.counted && this.x + this.width < this.bird.x) {
            flappyGame.score++;
            this.counted = true;
        }
        this.draw(ctx, canvas);
    }

    draw(ctx, canvas) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
}
