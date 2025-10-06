const btnRegisterForm = document.querySelector(".btn-start-register");
const btnLoginForm = document.querySelector(".btn-start-sesion");

const formLogin = document.querySelector(".login");

btnLoginForm.addEventListener("click", (e) => {
    e.preventDefault();
    let inputForm = document.querySelectorAll(".required");
    showError(inputForm);
    if (verification(inputForm)) {
        window.location.href = "index.html";
    }
})

btnRegisterForm.addEventListener("click", (e) => {
    e.preventDefault();
    let inputForm = document.querySelectorAll(".requiredRegister");
    showError(inputForm);
    if (verification(inputForm) && verificationPass()) {
        formLogin.classList.add("hide");
        let confirmMensage = document.querySelector(".register-comfirm");
        confirmMensage.classList.remove("hide");
        confirmMensage.classList.add("show-confirmation");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 5000);
    }
})

//si un input esta vacio devuelve false
function verification(inputForm) {
    for (let input of inputForm) {
        if (input.type === "checkbox" && !input.checked) {
            let check = document.querySelector(".check");
            check.innerHTML = "verifica que no eres un robot";
            return false;
        }
        if (input.value === "") {
            return false;
        }
    }
    return true;
}

function verificationPass() {
    let pass = document.querySelector("#password-register");
    let passRep = document.querySelector("#password-repeat");
    let equals = document.querySelector(".equals");
    if (pass.value.length < 5) {
        pass.classList.add("incomplete");
        return false;
    } else {
        pass.classList.remove('incomplete');
        if (pass.value !== passRep.value) {
            equals.innerHTML = "Las contraseñas deben coincidir ";
            pass.classList.add("incomplete");
            passRep.classList.add("incomplete");
            return false;
        } else {
            pass.classList.remove('incomplete');
            passRep.classList.remove('incomplete');
            return true;
        }
    }
}


//Le aviso al usuario donde debe completar
function showError(inputForm) {
    for (let input of inputForm) {
        if (input.value === "") {
            input.classList.add('incomplete');
        } else {
            input.classList.remove('incomplete');
        }
    }
}