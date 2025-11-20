class Bread {
    constructor() {
        this.element = document.getElementById("bread");
        this.reset();
    }

    reset() {
        this.x = 300;
        this.y = -400; // inicia fuera de pantalla
        this.speed = 2;

        // Aplicar posición
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        this.collected = false;
    }

    update(game) {
        if (game.gameOver) return;

        this.y += this.speed;

        this.element.style.top = this.y + "px";

        // Si sale del fondo → respawn arriba
        if (this.y > game.canvas.height + 100) {
            this.reset();
        }
    }

    checkCollision(bird) {
        const breadRect = this.element.getBoundingClientRect();
        const birdRect = bird.element.getBoundingClientRect();

        return !(
            birdRect.right < breadRect.left ||
            birdRect.left > breadRect.right ||
            birdRect.bottom < breadRect.top ||
            birdRect.top > breadRect.bottom
        );
    }

    hide() {
        this.element.style.opacity = "0";
    }

    show() {
        this.element.style.opacity = "1";
    }
    showBonusNotification() {
        const notification = document.getElementById("bonusNotification");
        notification.classList.remove("hide");
        notification.classList.add("show");

        //ocultar la notificación después de 1 segundo
        setTimeout(() => {
            notification.classList.remove("show");
            notification.classList.add("hide");
        }, 1000);
    }
}
