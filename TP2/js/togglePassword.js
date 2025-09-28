"use strict";

let eyeIcon = document.querySelectorAll(".toggle-password").forEach(eyeIcon => {
    eyeIcon.addEventListener("click", togglePassword);
});

function togglePassword() {
    // paso el icono que dispara el evento
    let eyeIcon = this;
    // guardo en una variable el input anterior al icono
    let passwordField = eyeIcon.previousElementSibling;
    //obtengo el valor del atributo type y lo cambio, si es password lo cambio a text y viceversa
    let type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    eyeIcon.classList.toggle("fa-eye-slash");
    eyeIcon.classList.toggle("fa-eye");
}
