
class Controller {
    constructor(canvasId) {
        this.model = new Model(); 
        this.view = new View(canvasId);
        
        // Variables para gestionar el drag and drop
        this.isDragging = false; // Indica si se está arrastrando una ficha
        this.fichaOriginal = null; // Guarda posición original para restaurar si el movimiento es inválido
        this.timerInterval = null;
        this.dragStartX = 0; 
        this.dragStartY = 0;
        
        this.setupEventos();
        this.iniciar();
    }

    setupEventos() {
        // Eventos del canvas para drag and drop
        const canvas = this.view.canvas;
        canvas.addEventListener("mousedown", e => this.onMouseDown(e));
        canvas.addEventListener("mouseup", e => this.onMouseUp(e));
        canvas.addEventListener("mousemove", e => this.onMouseMove(e));
        
        // Delegación de eventos para TODOS los botones (incluyendo cerrar)
        document.addEventListener("click", e => {
            // Verificar si el click fue en un botón con id
            const btn = e.target.closest("[id^='btn-'], [id^='close-']");
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                this.handleBoton(btn.id);
            }
        });
        
        // Event listeners para selección de personajes
        document.querySelectorAll(".ficha-option").forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                this.seleccionarFicha(e.currentTarget.dataset.ficha);
            });
        });
    }

    handleBoton(btnId) {
        const acciones = {
            "btn-play": () => this.view.mostrarOverlay("seleccion"),
            "btn-comenzar": () => this.comenzarJuego(),
            "btn-instrucciones": () => {
                this.detenerTimer();
                this.view.mostrarOverlay("instrucciones");
            },
            "btn-fichas": () => {
                this.detenerTimer();
                this.view.mostrarOverlay("seleccion");
            },
            "btn-reiniciar": () => this.reiniciar(),
            "btn-reiniciar-fin": () => this.reiniciar(),
            "btn-menu": () => this.volverMenu(),
            "btn-menu-fin": () => this.volverMenu(),
            "close-instrucciones": () => this.cerrarOverlay(),
            "close-seleccion": () => this.cerrarOverlay()
        };
        
        // Ejecutar la acción correspondiente si existe
        if (acciones[btnId]) {
            acciones[btnId]();
        }
    }

    /**
     * Inicializa el juego mostrando la pantalla de inicio
     */
    iniciar() {
        this.view.mostrarOverlay("inicio");
        this.view.draw(this.model);
    }


    seleccionarFicha(src) {
        // Guardar tipo de ficha pero NO inicializar todavía
        this.model.tipoFicha = src;
        
        // Cerrar overlay y mostrar tablero vacío
        this.view.ocultarOverlays();
        this.view.mostrarTableroVacio(true);
        this.view.mostrarControles();
        
        // Dibujar tablero vacío
        this.view.draw(this.model);
        
        // Inicializar fichas y comenzar después de un pequeño delay
        setTimeout(() => {
            this.model.inicializarTablero();
            this.view.mostrarTableroVacio(false);
            this.comenzarJuego();
        }, 500);
    }


    comenzarJuego() {
        if (!this.model.tipoFicha) {
            return this.view.mostrarOverlay("seleccion");
        }
        
        this.iniciarTimer();
        this.animarJuego();
    }

    /*
     * Cierra cualquier overlay abierto y reanuda el juego si está en progreso
     */
    cerrarOverlay() {
        this.view.ocultarOverlays();
        // Solo reanudar temporizador si hay un juego en curso (fichas inicializadas)
        if (this.model.tipoFicha && this.model.fichas && this.model.fichas.length > 0) {
            this.iniciarTimer();
        }
    }


    reiniciar() {
        this.detenerTimer();
        this.model.reiniciar();
        this.view.clearSelection();
        this.view.ocultarOverlays();
        this.view.mostrarControles();
        this.iniciarTimer();
        this.view.draw(this.model);
    }

    volverMenu() {
        this.detenerTimer();
        this.model = new Model(); // Crear nuevo modelo limpio
        this.view.clearSelection();
        this.view.ocultarControles(); // Ocultar controles
        this.iniciar();
    }

    // ========== GESTIÓN DEL TEMPORIZADOR ==========
    iniciarTimer() {
        this.detenerTimer(); // Limpiar timer anterior si existe
        this.model.remainingTime = this.model.timeLimit;
        this.view.actualizarTimer(this.model.remainingTime);
        
        // Decrementar cada segundo
        this.timerInterval = setInterval(() => {
            this.model.remainingTime--;
            this.view.actualizarTimer(this.model.remainingTime);
            
            // Verificar si se acabó el tiempo
            if (this.model.remainingTime <= 0) {
                this.finalizarJuego("¡Se acabó el tiempo!");
            }
        }, 1000);
    }

    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // ========== SISTEMA DE DRAG AND DROP ==========
    //  Maneja el evento mousedown - inicio del drag
    //  Selecciona la ficha clickeada y calcula sus movimientos válidos

    onMouseDown(e) {
        // No hacer nada si no hay juego iniciado o no hay fichas
        if (!this.model.tipoFicha || !this.model.fichas || this.model.fichas.length === 0) return;
        
        const coords = this.view.getCoordsCanvas(e);
        const ficha = this.view.encontrarFichaEnPosicion(coords.x, coords.y, this.model.fichas);
        
        if (ficha) {
            // Calcular movimientos válidos ANTES de seleccionar
            const movimientosValidos = this.model.calcularMovimientosValidos(ficha);
            
            // Solo seleccionar si la ficha tiene movimientos válidos
            if (movimientosValidos.length > 0) {
                this.view.selectedFicha = ficha;
                this.view.hints = movimientosValidos;
                
                // Guardar posición original para restaurar si es necesario
                this.fichaOriginal = {
                    x: ficha.posX,
                    y: ficha.posY,
                    row: ficha.row,
                    col: ficha.col
                };
                
                // Guardar posición inicial del drag
                this.dragStartX = coords.x;
                this.dragStartY = coords.y;
                
                this.isDragging = true;
                this.view.draw(this.model);
            }
        }
    }

    onMouseMove(e) {
        if (!this.isDragging || !this.view.selectedFicha) return;
        
        const coords = this.view.getCoordsCanvas(e);
        
        // Calcular diferencia desde el inicio del drag
        const deltaX = coords.x - this.dragStartX;
        const deltaY = coords.y - this.dragStartY;
        
        // Solo mover si hay un desplazamiento mínimo (evita clicks accidentales)
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            // Actualizar posición visual de la ficha
            this.view.selectedFicha.setPosition(coords.x, coords.y);
            this.view.draw(this.model);
        }
    }


    onMouseUp(e) {
        if (!this.isDragging || !this.view.selectedFicha) return;
        
        const coords = this.view.getCoordsCanvas(e);
        
        // Calcular si hubo movimiento significativo
        const deltaX = coords.x - this.dragStartX;
        const deltaY = coords.y - this.dragStartY;
        const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        let movimientoExitoso = false;
        
        // Solo procesar movimiento si hubo drag significativo (más de 10 píxeles)
        if (distancia > 10) {
            movimientoExitoso = this.procesarMovimiento(coords.x, coords.y);
        }
        
        // Si el movimiento NO fue exitoso, restaurar posición original
        if (!movimientoExitoso && this.fichaOriginal) {
            this.view.selectedFicha.setPosition(this.fichaOriginal.x, this.fichaOriginal.y);
            this.view.selectedFicha.setFilaColumna(this.fichaOriginal.row, this.fichaOriginal.col);
        }
        
        // Limpiar estado de drag
        this.isDragging = false;
        this.view.clearSelection();
        this.view.draw(this.model);
        
        // Verificar condiciones de fin de juego solo si hubo movimiento exitoso
        if (movimientoExitoso) {
            this.verificarEstadoJuego();
        }
    }


    //  Procesa el intento de movimiento de una ficha
    //  Si el movimiento es válido, actualiza el modelo
    procesarMovimiento(x, y) {
        const ficha = this.view.selectedFicha;
        const celda = this.model.encontrarCeldaMasCercana(x, y);
        
        // Verificar si la celda destino está vacía
        if (celda && this.model.estado[celda.row][celda.col] === 0) {
            // Intentar mover la ficha
            if (this.model.moverFicha(ficha, celda.row, celda.col)) {
                const pos = this.model.getPosicionCelda(celda.row, celda.col);
                ficha.setPosition(pos.x, pos.y);
                return true;
            }
        }
        
        return false;
    }

    verificarEstadoJuego() {
        if (this.model.verificarVictoria()) {
            const tiempo = this.model.timeLimit - this.model.remainingTime;
            let mensaje = `¡Ganaste en ${tiempo}s!`;
            
            // Verificar si es un nuevo récord
            if (!this.model.recordTime || tiempo < this.model.recordTime) {
                this.model.recordTime = tiempo;
                mensaje += " ¡Nuevo récord!";
            }
            
            return this.finalizarJuego(mensaje);
        }
        
        if (!this.model.tieneMovimientosValidos()) {
            this.finalizarJuego("¡Perdiste! No hay movimientos válidos");
        }
    }

    //  Finaliza el juego y muestra el mensaje correspondiente

    finalizarJuego(mensaje) {
        this.detenerTimer();
        this.view.mostrarMensajeFin(mensaje);
    }


    //   Loop principal de animación del juego
    //  Se ejecuta continuamente mientras hay un tipo de ficha seleccionado

    animarJuego() {
        if (this.model.tipoFicha) {
            this.view.draw(this.model);
            requestAnimationFrame(() => this.animarJuego());
        }
    }
}



document.addEventListener("DOMContentLoaded", () => {
    new Controller("canvasPeg");
});
