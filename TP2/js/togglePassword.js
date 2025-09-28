"use strict";

const loginContainer = document.getElementById("container-login");
const registerContainer = document.getElementById("container-register");

const btnLogin = document.getElementById("btn-login");
const btnRegister = document.getElementById("btn-registration");

btnRegister.addEventListener("click", () => {
  loginContainer.classList.add("oculto");
  registerContainer.classList.remove("oculto");
});

btnLogin.addEventListener("click", () => {
  registerContainer.classList.add("oculto");
  loginContainer.classList.remove("oculto");
});
