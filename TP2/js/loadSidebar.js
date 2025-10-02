// sidebarLoader.js
document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
});

function loadSidebar() {
    fetch('sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // Insertar el contenido del sidebar en el contenedor
            document.getElementById('sidebar-container').innerHTML = html;
            
            // Una vez cargado, inicializar funcionalidades
            initializeSidebar();
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });
}

function initializeSidebar() {
    // El sidebar ya está en el DOM, ahora podemos usar los selectores CSS
    
    // Opcional: agregar event listeners adicionales si es necesario
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            document.getElementById('menu-toggle').checked = false;
        });
    }
}
