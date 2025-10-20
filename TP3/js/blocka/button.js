class Button {
    constructor(x, y, width, height, text = "", shape = "rect") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.shape = shape;
    }

    // Dibuja el botón.
    draw(ctx) {
        ctx.fillStyle = "#F72585";
        
        if (this.shape === "circle") {
            //calculo el centro y el radio
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = Math.min(this.width, this.height) / 2;

            //dibujo el circulo
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Dibujo el triángulo de "Play"
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineCap = "round"; //con lineJoin, lineCap y lineWidth hago las puntas con efecto redondeado
            const size = radius * 0.4;
            ctx.moveTo(centerX - size / 2, centerY - size / 1.5);
            ctx.lineTo(centerX - size / 2, centerY + size / 1.5);
            ctx.lineTo(centerX + size / 1.5, centerY);
            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 6; 
            ctx.stroke();
            ctx.fill();

        } else if (this.shape === "rect") {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "white";
            ctx.font = "22px Roboto";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 );
        }
    }

    // Comprueba si un punto (mouseX, mouseY) está dentro del área del botón.
    isClicked(mouseX, mouseY) {
        if (this.shape === "circle") {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = Math.min(this.width, this.height) / 2;
            const dx = mouseX - centerX;
            const dy = mouseY - centerY;
            return dx * dx + dy * dy <= radius * radius;
        } else if (this.shape === "rect") {
            return (
                mouseX >= this.x && mouseX <= this.x + this.width &&
                mouseY >= this.y && mouseY <= this.y + this.height
            );
        }
        return false;
    }
}