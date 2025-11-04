
class View {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        
        this.tableroImage = new Image();
        this.tableroImage.src = "img/imgPeg/tablero.png";
        
        this.inicioImage = new Image();
        this.inicioImage.src = "img/imgJuegos/re_peg-solitarie.png";
        
        this.hints = []; // Posiciones donde se puede soltar la ficha seleccionada
        this.animAngle = 0; // Ángulo para animación de hints
        this.selectedFicha = null;
        this.mostrandoTableroVacio = false; // Flag para mostrar tablero sin fichas
        
        // Referencias a elementos HTML del DOM
        this.elementos = {
            overlays: {
                inicio: document.getElementById("overlay-inicio"),
                seleccion: document.getElementById("overlay-seleccion"),
                instrucciones: document.getElementById("overlay-instrucciones"),
                fin: document.getElementById("overlay-fin")
            },
            controls: document.getElementById("game-controls"),
            timer: document.getElementById("timer-display"),
            finMensaje: document.getElementById("fin-mensaje")
        };
        
        // Ocultar controles al inicio
        this.ocultarControles();
        
        // Iniciar loop de animación de hints
        this.animarHints();
    }

    draw(model) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (model.tipoFicha) {
            this.drawJuego(model); // Dibujar el juego en progreso
        } else {
            this.drawInicio(); // Dibujar pantalla de inicio
        }
    }

    drawInicio() {
        if (this.inicioImage.complete) {
            this.ctx.drawImage(this.inicioImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawJuego(model) {
        // Verificar que la imagen del tablero esté cargada
        if (!this.tableroImage.complete) return;
        
        // Calcular escala para centrar el tablero en el canvas
        const scale = this.canvas.height / this.tableroImage.height;
        const width = this.tableroImage.width * scale;
        const x = (this.canvas.width - width) / 2;
        
        // Dibujar tablero de fondo
        this.ctx.drawImage(this.tableroImage, x, 0, width, this.canvas.height);
        
        // Solo dibujar fichas si NO se está mostrando el tablero vacío
        // y si existen fichas (después de seleccionar personaje)
        if (!this.mostrandoTableroVacio && model.fichas && model.fichas.length > 0) {
            // Dibujar todas las fichas excepto la seleccionada
            // (la seleccionada se dibuja al final para que aparezca encima)
            model.fichas.forEach(ficha => {
                if (ficha !== this.selectedFicha) ficha.draw(this.ctx);
            });
            
            // Dibujar ficha seleccionada encima de todas
            if (this.selectedFicha) {
                this.selectedFicha.draw(this.ctx);
            }
        }
        
        // Dibujar hints animados si existen
        if (this.hints.length > 0 && !this.mostrandoTableroVacio) {
            this.drawHints();
        }
    }


    drawHints() {
        // Calcular factor de animación (oscila entre 0 y 1)
        const t = (Math.sin(this.animAngle) + 1) / 2;
        const ctx = this.ctx;
        
        ctx.save();
        ctx.strokeStyle = "#F72585"; // Color rosa de las flechas
        ctx.lineWidth = 8;

        // Dibujar una flecha por cada posición válida
        this.hints.forEach(pos => {
            const size = 25 + 10 * t; // Tamaño variable de la flecha
            const x = pos.x;
            const y = pos.y - 50 - 10 * t; // Posición vertical oscilante

            // Dibujar flecha apuntando hacia abajo
            ctx.beginPath();
            ctx.moveTo(x, y); // Inicio de la flecha
            ctx.lineTo(x, y + size); // Línea principal
            // Puntas de la flecha
            ctx.moveTo(x - size / 3, y + size * 0.6);
            ctx.lineTo(x, y + size);
            ctx.lineTo(x + size / 3, y + size * 0.6);
            ctx.stroke();
        });

        ctx.restore();
    }

  
    //   Loop de animación para los hints
    //   Incrementa el ángulo continuamente para crear animación suave
  
    animarHints() {
        this.animAngle += 0.1; // Velocidad de oscilación
        requestAnimationFrame(() => this.animarHints());
    }

    //  Muestra un overlay específico y oculta los demás
    //  Nombre del overlay a mostrar ('inicio', 'seleccion', etc.)
    mostrarOverlay(tipo) {
        // Ocultar todos los overlays primero
        Object.values(this.elementos.overlays).forEach(o => {
            o.classList.remove("active");
        });
        // Mostrar el overlay solicitado
        if (this.elementos.overlays[tipo]) {
            this.elementos.overlays[tipo].classList.add("active");
        }
    }

    //   Oculta todos los overlays
    
    ocultarOverlays() {
        Object.values(this.elementos.overlays).forEach(o => {
            o.classList.remove("active");
        });
    }

    //  Muestra los controles del juego
    mostrarControles() {
        if (this.elementos.controls) {
            this.elementos.controls.style.display = "flex";
        }
    }

    // Oculta los controles del juego
    ocultarControles() {
        if (this.elementos.controls) {
            this.elementos.controls.style.display = "none";
        }
    }

    mostrarTableroVacio(mostrar) {
        this.mostrandoTableroVacio = mostrar;
    }

    actualizarTimer(tiempo) {
        this.elementos.timer.textContent = `Tiempo: ${tiempo}s`;
    }

    mostrarMensajeFin(mensaje) {
        this.elementos.finMensaje.textContent = mensaje;
        this.mostrarOverlay("fin");
    }

    setSelectedFicha(ficha) {
        this.selectedFicha = ficha;
    }

    //  Limpia la selección actual y los hints
    clearSelection() {
        this.selectedFicha = null;
        this.hints = [];
    }


    //  Encuentra qué ficha (si hay alguna) está en una posición específica
    //  Coordenada x en el canvas
    //  Coordenada y en el canvas
    //  Array de fichas a verificar
    //  La ficha encontrada o null
    encontrarFichaEnPosicion(x, y, fichas) {
        // Verificar que el array de fichas exista y tenga elementos
        if (!fichas || fichas.length === 0) return null;
        
        // Iterar desde el final para seleccionar la ficha de "arriba"
        for (let i = fichas.length - 1; i >= 0; i--) {
            if (fichas[i].isPointInside(x, y)) {
                return fichas[i];
            }
        }
        return null;
    }

    getCoordsCanvas(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
}
