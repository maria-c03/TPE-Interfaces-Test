const pipeTop = new Image();
pipeTop.src = "img/imgFlappy/treeTop.png";
const pipeBottom = new Image();
pipeBottom.src = "img/imgFlappy/treeBottom.png";

class Pipe {
    constructor(canvas, bird) {
        this.canvas = canvas;
        this.bird = bird;
        const gap = 300; // hueco fijo donde pasa el pájaro
        this.top = Math.random() * (canvas.height - gap);
        this.bottom = canvas.height - this.top - gap;
        this.x = canvas.width;
        this.width = 130;
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
        ctx.drawImage(
            pipeTop,
            this.x,
            this.top - pipeTop.height,
            this.width,
            pipeTop.height
        );

        ctx.drawImage(
            pipeBottom,
            this.x,
            canvas.height - this.bottom,
            this.width,
            pipeBottom.height
        );
    }
}
