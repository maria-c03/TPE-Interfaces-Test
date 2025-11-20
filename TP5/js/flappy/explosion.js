class Explosion {
    constructor() {
        this.element = document.getElementById("explotion");
    }

    update(x, y) {
        const offsetX = 8;
        const offsetY = 3.5; // para que se vea centrada la explosión con respecto al pájaro

        this.element.style.top = `${y + offsetY}px`;
        this.element.style.left = `${x + offsetX}px`;

        this.element.style.display = "block";
        this.element.style.animation = "boom 1s steps(8) forwards";
        this.element.onanimationend = () => {
            this.element.style.display = "none";
            // Limpia el listener para que no interfiera si se vuelve a usar el elemento
            this.element.onanimationend = null;
        };
    }
}
