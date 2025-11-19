"use strict";

class Game {
    constructor(name, img, price, getGame){
        this.name = name;
        this.img = img;
        this.price = price;
        this.getGame = false;
    }
}

const games = {
    accion: [
        new Game("Call of duty warzone", "ac_call-of-duty-warzone.jpg", 15.00),
        new Game("Cyberpunk", "ac_cyberpunk.jpg", 0.00),
        new Game("Dota 2", "ac_dota-2.jpg", 0.00),
        new Game("Dying light the beast", "ac_dying-light-the-beast.jpg", 35.00),
        new Game("Helldivers 2", "ac_helldivers-2.jpg", 35.00),
        new Game("Peak", "ac_peak.jpg", 0.00),
        new Game("Red dead redemption 2", "ac_red-dead-redemption-2.jpg", 40.00),
        new Game("Sekiro", "ac_sekiro.jpg", 60.00),
        new Game("Apex legends", "ac_apex-legends.jpg", 0.00),
        new Game("Hades 2", "ac_hades-2.jpg", 0.00),
    ],
    aventura: [
        new Game("Sons of the forest", "av_sons-of-the-forest.jpg", 15.00),
        new Game("Rust", "av_rust.jpg", 0.00),
        new Game("Baldurs gate", "av_baldurs-gate.jpg", 25.00),
        new Game("Terraria", "av_terraria.jpg", 3.00),
        new Game("Howarts legacy", "av_howarts-legacy.jpg", 30.00),
        new Game("Forza horizon 5", "av_forza-horizon-5.jpg", 0.00),
        new Game("Expedition 33", "av_expedition-33.jpg", 15.00),
        new Game("Little nightmares 2", "av_little-nightmares-2.jpg", 0.00),
        new Game("Peak", "ac_peak.jpg", 3.99),
    ],
    terror: [
        new Game("Dead by daylight", "te_dead-by-daylight.jpg", 0.00),
        new Game("Phasmophobia", "te_phasmophobia.jpg", 15.00),
        new Game("Proyect zomboid", "te_project-zomboid.jpg", 0.00),
        new Game("R.E.P.O", "te_repo.jpg", 8.00),
        new Game("Diablo 4", "te_diablo-4.jpg", 25.00),
        new Game("Once human", "te_once-human.jpg", 0.00),
        new Game("Subnautica", "te_subnautica.jpg", 10.00),
        new Game("Day z", "te_day-z.jpg", 49.99),
        new Game("Elden ring", "te_elden-ring.jpg", 57.00),
    ],
    recomendados: [
        new Game("Marvel Blocka!", "marvel_blocka.jpg", 0.00),
        new Game("Peg simpsonizado", "re_peg-solitarie.png", 0.00),
        new Game("Flappy", "re_flappy.jpg", 0.00),
        new Game("townsmen", "re_townsmen.jpg", 9.99),
        new Game("Stardew Valley", "re_stardew-valley.jpg", 15.99),
        new Game("Palia", "re_palia.jpg", 0.00),
        new Game("Haven", "re_haven.jpg", 3.00),
        new Game("Desperados", "re_desperados.jpg", 0.00),
        new Game("Biped", "re_biped.jpg", 5.00),
        new Game("Dredge", "re_dredge.jpg", 10.00),
    ],
    logica: [
        new Game("Kings hand", "re_kings-hand.jpg", 0.00),
        new Game("Drop duchy", "lo_drop-duchy.jpg", 0.00),
        new Game("Monument valley", "lo_monument-valley.jpg", 7.99),
        new Game("Canvas", "lo_canvas.jpg", 15.00),
        new Game("Battleship", "lo_battleship.jpg", 0.00),
        new Game("Catan", "lo_catan.jpg", 3.00),
        new Game("Munchkin", "lo_munchkin.jpg", 12.99),
        new Game("Monopoly", "lo_monopoly.jpg", 0.00),
        new Game("Cats in time", "lo_cats-in-time.jpg", 0.00),
    ],
    deportes: [
        new Game("Rematch", "de_rematch.jpg", 0.00),
        new Game("Ea sports FC", "de_ea-sports-fc-26.jpg", 25.99),
        new Game("F1", "de_f1-25.jpg", 23.00),
        new Game("ReMatch", "de_rematch.jpg", 0.00),
        new Game("Skate", "de_skate.jpg", 0.00),
        new Game("WGT Golf", "de_wgt-golf.jpg", 15.00),
        new Game("Street Fighter", "de_street-fighter.jpg", 10.99),
        new Game("WWE", "de_wwe.jpg", 0.00),
        new Game("Ride", "de_ride.jpg", 18.00),
    ],
    click: [
        new Game("Plinko", "cl_plinko.jpg", 0.00),
        new Game("Capybara clicker", "cl_capybara-clicker.jpg", 10.99),
        new Game("Truco", "cl_truco.jpg", 5.99),
        new Game("Click click dig", "cl_click-click-dig.jpg", 18.00),
        new Game("Poker", "cl_poker.jpg", 6.00),
        new Game("Hidden objects", "cl_hidden-objects.jpg", 0.00),
        new Game("Domino", "cl_domino.jpg", 0.00),
        new Game("Conga", "cl_conga.jpg", 0.00),
        new Game("Solitario", "cl_solitario.jpg", 15.00),
    ]
}



// Cuando el DOM este listo inica la carga de la pagina
document.addEventListener("DOMContentLoaded", startPage);

// recorro las categorias y genero los carruseles
function startPage(){
   
    let categoryContainer = document.querySelectorAll(".category-container");
    //recorro las cartegorias 
    categoryContainer.forEach(category =>{
        //guardo el tipo de categoria del contenedor
        let categoryType = category.dataset.category; 
        
        // Selecciono el carousel que está dentro de este category-container
        let carousel = category.querySelector(".carousel");
        
        //si existe la categoria la paso por parametro al carrusel
        if(games[categoryType]) {
            createCarousel(games[categoryType], carousel);
        }
        //selecciono los botones que estan dentro de este category-container
        let btnLeft = category.querySelector(".btn-left");
        let btnRight = category.querySelector(".btn-right");
        
        //sin efecto de inclinacion
        // creo los eventos sobre los botones
        // btnLeft.addEventListener('click', () => { 
        //     sliderCarousel(carousel, -window.innerWidth / 2)
        //     });
        //     window.innerWidht/2 --> Desplaza el carrusel la mitad del ancho de la ventana
        // btnRight.addEventListener('click', () => { 
        //         sliderCarousel(carousel, window.innerWidth / 2)
        //     });

        //Con efecto de inclinacion de la imagen
        btnLeft.addEventListener('click', () => {
        const images = carousel.querySelectorAll(".game-img");
        images.forEach(img => img.classList.add("skew-left"));

        sliderCarousel(carousel, -window.innerWidth / 2);

        setTimeout(() => {
            images.forEach(img => img.classList.remove("skew-left"));
            }, 300);
        });

        btnRight.addEventListener('click', () => {
            const images = carousel.querySelectorAll(".game-img");
            images.forEach(img => img.classList.add("skew-right"));

            sliderCarousel(carousel, window.innerWidth / 2);

            setTimeout(() => {
                images.forEach(img => img.classList.remove("skew-right"));
            }, 300);
        });
    })

}

// muevo el carrusel horizontalmente con un movimiento lento
// direccion negativa (me muevo a la izquierda)
// positiva (me muevo a la derecha)
function sliderCarousel(carousel, direction) {
        carousel.scrollBy({
            left: direction,
            behavior: 'smooth'
        });
    }


function createCarousel(games, carousel){
    for(const game of games){
        createCard(game, carousel);
    }
}

function createCard(game, carousel){

    let cardContainer = document.createElement("div");
    cardContainer.classList = "card-content";
        
    let cardImg = document.createElement("div");
    cardImg.classList = "card-img";

    let heartContainer = document.createElement("div");
    heartContainer.classList = "heart-container";
    
    let iconHeart = document.createElement("img");
    iconHeart.classList = "heart";
    iconHeart.src = `img/icons/heart.png`;
    iconHeart.alt = "Agregar a favoritos";
    //como los corazones arrancan blancos los inicializo en false
    let addFavorite = false;
    heartContainer.addEventListener("click", () => {
        addFavorite = addFavoriteGame(addFavorite, iconHeart);
    })
    
    heartContainer.appendChild(iconHeart);
    cardImg.appendChild(heartContainer);
    
    let imgGame = document.createElement("img"); 
    imgGame.classList = "game-img";
    //le asigo la imagen
    imgGame.src = `img/imgJuegos/${game.img}`; 
    imgGame.alt = game.name;    

    cardImg.appendChild(imgGame);

    let textContainer = document.createElement("div");
    textContainer.classList = "text-container";

    let gameContent = document.createElement("div");
    gameContent.classList = "game-content";
    
    let gameName = document.createElement("p");
    gameName.classList = "game-name";
    //asigno nombre
    gameName.textContent = game.name;
    
    //Pecio del juego
    let gamePrice = document.createElement("p");
    gamePrice.classList = "game-price";

    gameContent.appendChild(gameName);
    gameContent.appendChild(gamePrice);


    //asigno precio
    if(game.price == 0){
        gamePrice.textContent = "Gratis";
        gamePrice.classList = "free-game";
    }else{
        gamePrice.textContent = `$ ${game.price.toFixed(2)}`;
        // toFixed(2) método de los números en JavaScript que redondea 
        // y convierte el número a una cadena con exactamente 2 decimales
    }
    
    
    let buttonFree = document.createElement("div");
    buttonFree.classList = "product-free";

    let buttonBuy = document.createElement("div");
    buttonBuy.classList = "product";
    
    let linkGame = document.createElement("a");
    linkGame.classList = "link-game";
        // linkGame.href = "game.html";
    function redirectGamePage(){
        if(game.name == "Peg simpsonizado"){
            linkGame.href = "game.html";
        }
        else if(game.name == "Marvel Blocka!"){
            linkGame.href = "game-blocka.html";
        }
        else if(game.name == "Flappy"){
            linkGame.href = "game-flappy.html";
        }
        else{
            linkGame.href = "index.html";
        }
        return linkGame;
    }
    
    let playBtn = document.createElement("i");
    playBtn.classList = "fa-solid fa-play";
        
    let buyBtn = document.createElement("i");
    buyBtn.classList = "fa-solid fa-cart-shopping";

    
    textContainer.appendChild(gameContent);
    //Boton jugar/comprar
    if(game.price == 0){
        linkGame.appendChild(playBtn);
        buttonFree.appendChild(redirectGamePage());
        textContainer.appendChild(buttonFree);
    } else {
        buttonBuy.appendChild(buyBtn);
        textContainer.appendChild(buttonBuy);


    }
    buyBtn.addEventListener("click", () => {
        game.getGame = addGame(buttonBuy, gamePrice, game);
    })

    cardContainer.appendChild(cardImg);
    cardContainer.appendChild(textContainer);
    
    carousel.appendChild(cardContainer);

    // creo la gerarquia en HTML
    // heartContainer.appendChild(iconHeart);

    // cardImg.appendChild(heartContainer);
    // cardImg.appendChild(imgGame);

    // gameContent.appendChild(gameName);
    // gameContent.appendChild(gamePrice);
    
    // linkGame.appendChild(playBtn);
    // buttonType.appendChild(linkGame);

    // textContainer.appendChild(gameContent);
    // textContainer.appendChild(buttonFree);
    // textContainer.appendChild(buttonBuy);
}

 // Agrego comportamiento al boton favoritos
    function addFavoriteGame(addFavoritev, iconHeart) {
        if (addFavoritev) {
            iconHeart.src = "img/icons/heart.png";
            return false;
        } else {
            iconHeart.src ="img/icons/heartRed.png";
            return true;
        }
    }

    function addGame(buttonBuy, gamePrice, game) {
    

    if (game.getGame) {
        // Si ya estaba agregado, al hacer click lo quitamos del carrito
        gamePrice.textContent = `$ ${game.price.toFixed(2)}`;
        buttonBuy.classList.remove("hideCart");
        return;
    } else {

        // Si el juego no estaba agregado
        buttonBuy.classList.add("hideCart");
        gamePrice.innerHTML = 'Agregado al carrito <i class="fa-solid fa-check"></i>';

        // Eventos para el hover y la eliminación
        const handleMouseEnter = () => {
            gamePrice.innerHTML = 'Eliminar del carrito <i class="fa-solid fa-trash"></i>';
        };
        
        const handleMouseLeave = () => {
            gamePrice.innerHTML = 'Agregado al carrito <i class="fa-solid fa-check"></i>';
        };

        const handleClick = () => {
 
            // Restauramos el estado original
            buttonBuy.classList.remove("hideCart");
            gamePrice.textContent = `$ ${game.price.toFixed(2)}`;

            // Quitamos los eventos para evitar acumulaciones
            gamePrice.removeEventListener("mouseenter", handleMouseEnter);
            gamePrice.removeEventListener("mouseleave", handleMouseLeave);
            gamePrice.removeEventListener("click", handleClick);

            game.getGame + false;
        };
  
        gamePrice.addEventListener("mouseenter", handleMouseEnter);
        gamePrice.addEventListener("mouseleave", handleMouseLeave);
        gamePrice.addEventListener("click", handleClick);
  
        game.getGame = true;
        return;
    }
}


//Como deberia verse en HTML
// <div class="card-content">
        // <div class="card-img">
        //         <button class="btn-heart">
        //             <i class="fa-solid fa-heart"></i>
        //         </button>
        //         <img src="./img/imgJuegos/pinguin.jpg" class="game-img" alt="Imagen de un juego">
        //     </div>
        //     <div class="text-container">
        //         <div class="game-content">
        //             <p class="game-name">Categotia</p>
        //             <p class="game-price">Precio</p>
        //         </div>
        //         <button class="product-type">
        //             <i class="fa-solid fa-play"></i>
        //         </button>
        // </div>
//</div>
