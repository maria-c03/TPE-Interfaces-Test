"use strict";


document.addEventListener("DOMContentLoaded", startPage);


function startPage(){
    const url = "https://vj.interfaces.jima.com.ar/api/v2";
    
    
    
    async function getData(){
        let saveJson = await fetch(url);
        let gamesData = await saveJson.json();
        
        const gamesByGenre = {};
        gamesData.forEach(game => {
            if (Array.isArray(game.genres)) {
                game.genres.forEach(genre => {
                    if (!gamesByGenre[genre.name]) {
                        gamesByGenre[genre.name] = [];
                    }
                    gamesByGenre[genre.name].push(game);
                });
            }
        });
        

        createCarousel();
        
    }
    
    function createCarousel(){
        let categoyContainer = document.querySelectorAll(".category-container");
        //creo el titulo de la categoria
        let title = document.createElement("h3");
        title.textContent = genre;
        categoyContainer.appendChild(title);
        let cardsContainer = document.createElement("div");
      

        Object.entries(gamesByGenre).forEach(([genre, gamesData]) => {
            
            // carouselContainer.meter las card
            createCard(gamesData);
            //cada vez que se crea una card la debo agregar a cardContainer


        })
             
        categoyContainer.appendChild(cardsContainer);
    }
    
    function createCard(gameData){

        let cardContainer = document.createElement("div");
        cardContainer.className = "card-content";
        
        let cardImg = document.createElement("div");
        cardImg.className = "card-img";

        let buttonHeart = document.createElement("button");
        buttonHeart.className = "btn-heart";

        let iconHart = document.createElement("i");
        iconHart.className = "fa-solid fa-heart";
        
        let imgGame = document.createElement("img"); 
        imgGame.className = "game-img";
        //le asigo la imagen de la api
        imgGame.src = game.background_image;        
        
        let textContainer = document.createElement("div");
        textContainer.className = "text-container";
        
        let gameContent = document.createElement("div");
        gameContent.className = "game-content";
        
        let gameName = document.createElement("p");
        gameName.className = "game-name";
        //asigno nombre desde la api
        gameName.textContent = gameData.name;
        
        let gamePrice = document.createElement("p");
        gamePrice.className = "game-price";
        //asigno precio de forma manual
        gamePrice.textContent = game.price;
        
        let buttonType = document.createElement("button");
        buttonType.className = "product-type";
        
        let playBtn = document.createElement("i");
        playBtn.className = "fa-solid fa-play";
        
        // creo la gerarquia en HTML
        buttonHeart.appendChild(iconHart);
        cardImg.appendChild(buttonHeart);
        cardImg.appendChild(imgGame);

        gameContent.appendChild(gameName);
        gameContent.appendChild(gamePrice);
        
        buttonType.appendChild(playBtn);

        textContainer.appendChild(gameContent);
        textContainer.appendChild(playBtn);

        cardContainer.appendChild(cardImg);
        cardContainer.appendChild(textContainer);


    }
    
    
    
    getData();



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



    // fetch(url)
    //     .then(response => response.json())
    //     .then(games => {
        //         console.log('Juegos disponibles:', games);
        //         // Procesar la lista de juegos con campos adicionales
        //         games.forEach(game => {
            //             console.log(`${game.name} - Rating: ${game.rating}`);
            //             console.log(`Descripción: ${game.description}`);
            //             console.log(`Imagen optimizada: ${game.background_image_low_res}`);
            //         });
            //     })
            //     .catch(error => {
                //         console.error('Error al obtener los juegos:', error);
    //     });
    
    //     async function cargarJuegos() {
        //         carrusel.innerHTML =
        //          `<div class="carousel">
        
        //         `
        
        // }
    }
    
    