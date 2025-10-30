class GameCart {
            constructor(name, img, price, getGame = false) {
                this.name = name;
                this.img = img;
                this.price = price;
                this.getGame = getGame;
            }
        }

        const gamesData = {
            accion: [
                new GameCart("Call of duty warzone", "ac_call-of-duty-warzone.jpg", 15.00),
                new GameCart("Cyberpunk", "ac_cyberpunk.jpg", 0.00),
                new GameCart("Dota 2", "ac_dota-2.jpg", 0.00),
                new GameCart("Dying light the beast", "ac_dying-light-the-beast.jpg", 35.00),
                new GameCart("Helldivers 2", "ac_helldivers-2.jpg", 35.00),
                new GameCart("Red dead redemption 2", "ac_red-dead-redemption-2.jpg", 40.00),
                new GameCart("Sekiro", "ac_sekiro.jpg", 60.00),
            ],
            aventura: [
                new GameCart("Sons of the forest", "av_sons-of-the-forest.jpg", 15.00),
                new GameCart("Rust", "av_rust.jpg", 0.00),
                new GameCart("Baldurs gate", "av_baldurs-gate.jpg", 25.00),
                new GameCart("Howarts legacy", "av_howarts-legacy.jpg", 30.00),
            ],
        };

        // Estado Global del Carrito (Contiene solo objetos Game únicos)
        let cart = []; 

        // ------------------- Funciones de Gestión del Carrito -------------------

        /**
         * Busca un juego por nombre en la estructura gamesData.
         * @param {string} name 
         * @returns {Game|undefined}
         */
        function findGameByName(name) {
            for (const category in gamesData) {
                const game = gamesData[category].find(g => g.name === name);
                if (game) return game;
            }
            return undefined;
        }

        /**
         * Calcula y actualiza el subtotal y el total en el UI.
         */
        function updateTotals() {
            const subtotal = cart.reduce((acc, item) => {
                // Sumamos solo el precio, ya que la cantidad es implícitamente 1 (juego o no está)
                return acc + item.price;
            }, 0);

            // El envío es gratis, por lo que el total es igual al subtotal.
            const total = subtotal; 

            document.getElementById('carrito-subtotal').textContent = `$ ${total.toFixed(2)}`;
            document.getElementById('carrito-total').textContent = `$ ${total.toFixed(2)}`;
            
            const productosContainer = document.getElementById('carrito-productos');
            if (cart.length === 0) {
                 productosContainer.innerHTML = '<p class="carrito-productos-vacio">El carrito está vacío. ¡Añade algunos juegos!</p>';
            }
        }
        
        /**
         * Renderiza un item individual del carrito.
         * @param {object} item - Objeto Game { name, price, img }
         * @returns {string} HTML del item.
         */
        function renderCartItem(item) {
            // El total del ítem es simplemente su precio
            const totalPrice = item.price.toFixed(2);
            
            // CAMBIO: Uso de la ruta de imagen local y clase CSS solicitada.
            const imgUrl = `./img/imgJuegos/${item.img}`;

            return `
                <div class="carrito-item" data-game-name="${item.name}">
                    <img src="${imgUrl}" alt="${item.name}" class="game-img cart-img">
                    <div class="item-info">
                        <p class="item-nombre">${item.name}</p>
                    </div>
                    <div class="item-acciones">
                        <p class="item-total">$ ${totalPrice}</p>
                        <i class="fa-solid fa-trash icon-hover item-eliminar" aria-label="Eliminar ${item.name}" data-game="${item.name}"></i>
                    </div>
                </div>
            `;
        }

        /**
         * Dibuja todo el contenido del carrito.
         */
        function renderCart() {
            const container = document.getElementById('carrito-productos');
            container.innerHTML = '';
            
            if (cart.length === 0) {
                 container.innerHTML = '<p class="carrito-productos-vacio">El carrito está vacío. ¡Añade algunos juegos!</p>';
            } else {
                cart.forEach(item => {
                    container.innerHTML += renderCartItem(item);
                });
            }

            // Después de renderizar, adjuntar eventos
            attachCartEventListeners();
            updateTotals();
        }
        
        /**
         * Maneja la eliminación de un producto del carrito.
         * @param {string} gameName 
         */
        function handleRemoveItem(gameName) {
            // Filtra el carrito para incluir solo los items cuyo nombre NO coincide
            cart = cart.filter(item => item.name !== gameName);
            renderCart(); // Vuelve a dibujar el carrito
        }

        /**
         * Adjunta los listeners de eventos a los botones de eliminar.
         */
        function attachCartEventListeners() {
            // Eventos de Eliminar
            document.querySelectorAll('.item-eliminar').forEach(icon => {
                icon.onclick = (e) => {
                    // Obtiene el nombre del juego del atributo data-game
                    const gameName = e.target.dataset.game;
                    handleRemoveItem(gameName);
                };
            });
        }
        
        /**
         * Inicializa el carrito con algunos juegos de ejemplo.
         */
        function initializeCart() {
            // Seleccionar 3 juegos iniciales para el demo
            const game1 = findGameByName("Helldivers 2");
            const game2 = findGameByName("Baldurs gate");
            const game3 = findGameByName("Red dead redemption 2");

            // Agregamos los objetos Game al carrito (implícitamente cantidad = 1)
            if (game1) cart.push(game1);
            if (game2) cart.push(game2);
            if (game3) cart.push(game3);
            
            renderCart();
        }

        // ------------------- Inicialización y Control de UI -------------------

        document.addEventListener('DOMContentLoaded', () => {
            // Elementos de la UI
            const btnAbrirCarrito = document.getElementById('btn-abrir-carrito');
            const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
            const carritoOverlay = document.getElementById('carrito-overlay');
            const carritoPanel = document.getElementById('carrito-panel');
            const btnIrAPagar = document.querySelector('.carrito-footer .btn-primario');
            const btnSeguirComprando = document.querySelector('.carrito-footer .btn-secundario');
            
            // Lógica de Apertura/Cierre
            const abrirCarrito = () => {
                carritoOverlay.style.display = 'block';
                setTimeout(() => {
                    carritoOverlay.classList.add('activo');
                }, 10); 
            };

            const cerrarCarrito = () => {
                carritoOverlay.classList.remove('activo');
                // Esperamos a que termine la transición CSS antes de ocultar el overlay
                const handler = (e) => {
                    if (e.target === carritoPanel) {
                        carritoOverlay.style.display = 'none';
                        carritoPanel.removeEventListener('transitionend', handler);
                    }
                };
                carritoPanel.addEventListener('transitionend', handler);
            };

            // Asignación de Eventos Principales
            if (btnAbrirCarrito) btnAbrirCarrito.addEventListener('click', abrirCarrito);
            if (btnCerrarCarrito) btnCerrarCarrito.addEventListener('click', cerrarCarrito);
            if (carritoOverlay) {
                carritoOverlay.addEventListener('click', (e) => {
                    if (e.target === carritoOverlay) cerrarCarrito();
                });
            }

            // Funcionalidad de Botones de Pago y Continuar
            
            // Botón "Ir a Pagar" (redirigir en nueva pestaña)
            if (btnIrAPagar) {
                btnIrAPagar.addEventListener('click', () => {
                    if (cart.length > 0) {
                        window.open('https://www.mercadopago.com.ar/home', '_blank');
                    } else {
                        // Mensaje de error si el carrito está vacío
                        console.error("No puedes ir a pagar con el carrito vacío.");
                    }
                });
            }

            // Botón "Seguir Comprando" (cerrar carrito)
            if (btnSeguirComprando) {
                btnSeguirComprando.addEventListener('click', cerrarCarrito);
            }

            // Inicializar el carrito al cargar la página
            initializeCart();
        });