"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    let width = canvas.width;
    let height = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 10, 10);


    const image1 = new Image();
    image1.src = "img/imgBlocka/image1.png";

    image1.onload = function () {
        ctx.drawImage(image1, 100, 100);
    }
})