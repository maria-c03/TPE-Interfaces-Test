"use strict";

// Creacion de elementos de HTML
const divLoadWindow = document.createElement("div");
divLoadWindow.id = "loadWindow";

const divLoadContent = document.createElement("div");
divLoadContent.id = "loadContent";

const divLogoLoad = document.createElement("div");
divLogoLoad.id = "logoLoad";

const imgLogoLoad = document.createElement("img");
imgLogoLoad.src = "./img/icons/logo.png";

// Le indico al div LogoLoad que es padre de imgLogoLoad
divLogoLoad.appendChild(imgLogoLoad);

const porcentLoad = document.createElement("p");
porcentLoad.id = "pLoad";

document.body.appendChild(divLoadWindow);

divLoadContent.appendChild(divLogoLoad);
divLoadContent.appendChild(porcentLoad);

divLoadWindow.appendChild(divLoadContent);

let count = 0;
const total = 100; // Simulated total loading steps
const duration = 5000; // Total duration of the loading in milliseconds
const intervalTime = duration / total; // Time between each step
document.body.classList.add("noScroll");

const interval = setInterval(() => {

    count++;
    pLoad.innerHTML = Math.round(count) + "%";

    if (count >= total) {
        clearInterval(intervalTime);
        pLoad.innerHTML = "100%";
        divLoadContent.style.animation = "pulseRotate 1s ease-in-out forwards";
        divLoadWindow.classList.add("finalize");
        setTimeout(() => {
            document.body.classList.remove("noScroll");
            divLoadWindow.style.display = "none";
        }, 2000); // Match the duration of the pulseRotate animation
    }
}, intervalTime);