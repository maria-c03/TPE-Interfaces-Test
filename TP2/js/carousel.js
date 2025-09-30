"use strict";


document.addEventListener("DOMContentLoaded", startPage);


function startPage(){
    const url = "https://vj.interfaces.jima.com.ar/api/v2";
    
    let carrusel = document.querySelector("#carousel-container");
    
    async function showInfo(){
        let saveJson = await fetch(url);
        let carruselData = await saveJson.json();
        for(let card of carruselData){
            console.log(card.id)
        }
        
        
    }
    showInfo();
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
    
    // <div class="category-container">
    //     <h3>Porque jugaste a Monopolis</h3>
    //     <div class="carousel"></div>
    // </div>