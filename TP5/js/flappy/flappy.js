class FlappyGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // --- Estado del juego ---
        this.spacepressed = false;
        this.frame = 0;
        this.score = 0;
        this.gameSpeed = 2;
        this.gameOver = false;
        this.frameId = null;
        this.timeLimit = 60;

        this.bird = new Bird();
        this.bread = new Bread();
        this.pipes = [];
        this.explosions = [];

        // --- Imagen de explosión ---
        this.explosionImage = new Image();
        this.explosionImage.src = "img/imgFlappy/explosion.png";

        this.setupControls();
    }

    setupControls() {
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                this.spacepressed = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                this.spacepressed = false;
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameOver) {
            this.handlePipes();
            this.bird.update(this);
            this.bread.update(this);
            this.handleBreadCollision();
            this.frame++;
        } else {
            this.handlePipes();     // tuberias detenidas
            this.bird.hide();     // pajaro detenido
        }

        this.handleExplosions();
        this.drawScore();
        this.handleCollisions();

        this.frameId = requestAnimationFrame(() => this.animate());
    }

    drawScore() {
        this.ctx.fillStyle = "black";
        this.ctx.font = "70px Roboto";
        this.ctx.strokeText(this.score, 1450, 70);
        this.ctx.fillText(this.score, 1450, 70);
    }

    handleExplosions() {
        for (let e of this.explosions) {
            e.update();
            e.draw(this.ctx, this.explosionImage);
        }
    }

    handlePipes() {
        if (this.gameOver) {
            this.pipes.forEach(pipe => pipe.draw(this.ctx, this.canvas));
            return;
        }

        if (this.frame % 150 === 0) { 
            this.pipes.push(new Pipe(this.canvas, this.bird));
        }

        this.pipes.forEach(pipe => pipe.update(this.ctx, this.canvas, this.gameSpeed, this));

        if (this.pipes.length > 20) this.pipes.shift();
    }

    handleCollisions() {
        for (let pipe of this.pipes) {

            if (
                this.bird.x < pipe.x + pipe.width &&           //borde izquierdo del pajaro antes del borde derecho de la tuberia
                this.bird.x + this.bird.width > pipe.x &&      //borde derecho del pajaro despues del borde izquierdo de la tuberia
                (
                    this.bird.y < pipe.top ||                                              //el pajaro esta por encima de la tuberia superior
                    this.bird.y + this.bird.height > this.canvas.height - pipe.bottom      //el pajaro esta por debajo de la tuberia inferior
                )
            ) {
                if (!this.gameOver) {
                    this.gameOverHandler();
                }
            }
        }
    }

    gameOverHandler() {
        if (this.gameOver) return;

        this.gameOver = true;
        clearInterval(this.timerId);
        this.timerId = null;
        // Explosion
        this.explosions.push(new Explosion(this.bird.x, this.bird.y));

        // Guardar score
        localStorage.setItem("lastScore", this.score);

        const best = localStorage.getItem("bestScore");
        if (!best || this.score > best) {
            localStorage.setItem("bestScore", this.score);
        }

        // Mostrar scores
        document.getElementById("finalScore").innerText = "Tu puntaje: " + this.score;
        document.getElementById("bestScoreLabel").innerText = localStorage.getItem("bestScore");

        // Mostrar modal
        document.getElementById("gameOverModal").classList.remove("hide");
        document.getElementById("gameOverModal").classList.add("show");
    }

    handleBreadCollision() {
        if (this.bread.collected) return;

        if (this.bread.checkCollision(this.bird)) {
            this.bread.collected = true;
            // Aumentar velocidad del juego
            this.gameSpeed += 3;
            // Ocultar pan
            this.bread.hide();

            // Reiniciar después de un segundo
            setTimeout(() => {
                this.bread.show();
                this.bread.reset();
            }, 1000);
        }
    }

    startTimer() {
        this.timerId = setInterval(() => {
            if (this.gameOver) {
                clearInterval(this.timerId);
                return;
            }

            this.timeLimit--;
            document.getElementById("timer").textContent = this.timeLimit + "s";

            if (this.timeLimit <= 0) {
                this.gameOverHandler();
            }
        }, 1000);
    }
}
document.getElementById("btnRestart").addEventListener("click", () => {
    location.reload();
});