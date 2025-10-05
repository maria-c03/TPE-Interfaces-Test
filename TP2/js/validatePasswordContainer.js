document.addEventListener('DOMContentLoaded', function() {
  // Selecciona todos los contenedores de password
  const passwordContainers = document.querySelectorAll('.container-password');

  passwordContainers.forEach(container => {
    // Busca el input de password dentro del contenedor
    const input = container.querySelector('input[type="password"]');
    // Busca el <p> dentro del contenedor
    const msg = container.querySelector('p');
    const inputcss = container.querySelector('input');
     if (!input || !msg) return;

    let touched = false;
    function checkPassword() {
      if (!touched && input.value.length === 0) {
        msg.classList.remove('valid', 'invalid');
        inputcss.classList.remove('invalid');
        return;
      }
      
      if (input.value.length >= 5) {
        msg.classList.add('valid');
        msg.classList.remove('invalid');
        inputcss.classList.remove('invalid');
      } else {
        msg.classList.remove('valid');
        inputcss.classList.add('invalid');
        msg.classList.add('invalid');
      }
    }
    input.addEventListener('input', function(e) {
      touched = true;
      checkPassword();
    });
    // Validación inicial (no muestra nada)
    checkPassword();
  });
});
