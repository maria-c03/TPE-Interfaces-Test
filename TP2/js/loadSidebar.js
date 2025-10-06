// loadSidebar.js
document.addEventListener("DOMContentLoaded", function () {
  loadSidebar();
});

function loadSidebar() {
  const sidebarHTML = `
<div class="sidebar">
  <ul>
    <li>
      <a href="/home"><span class="icon"><img src="./img/icons/categories-icon/Home.svg" alt="Home-icon">
        </span>
        Home</a>
    </li>
    <li>
      <a href="/recientes"><span class="icon"><img src="./img/icons/categories-icon/Recent.svg" alt="Recent-icon">
        </span>
        Recientes</a>
    </li>
    <li>
      <a href="/nuevos"><span class="icon"><img src="./img/icons/categories-icon/New.svg" alt="New-icon">
        </span>
        Nuevos</a>
    </li>
    <li>
      <a href="/tendencias"><span class="icon"><img src="./img/icons/categories-icon/Trending.svg" alt="Trending-icon">
        </span>
        Tendencias</a>
    </li>
    <li>
      <a href="/actualizados"><span class="icon"><img src="./img/icons/categories-icon/Updated.svg" alt="Updated-icon">
        </span>
        Actualizados</a>
    </li>
    <li>
      <a href="/multiplayer"><span class="icon"><img src="./img/icons/categories-icon/Multiplayer.svg" alt="Multiplayer-icon">
        </span>
        Multiplayer</a>
    </li>
    <li>
      <a href="/2jugadores"><span class="icon"><img src="./img/icons/categories-icon/2players.svg" alt="2players-icon">
        </span>
        2 Jugadores</a>
    </li>
    <li>
      <a href="/accion"><span class="icon"><img src="./img/icons/categories-icon/Action.svg" alt="Action-icon">
        </span>
        Acción</a>
    </li>
    <li>
      <a href="/aventura"><span class="icon"><img src="./img/icons/categories-icon/Adventure.svg" alt="Adventure-icon">
        </span>
        Aventura</a>
    </li>
    <li>
      <a href="/baloncesto"><span class="icon"><img src="./img/icons/categories-icon/Basketball.svg" alt="Basketball-icon">
        </span>
        Baloncesto</a>
    </li>
    <li>
      <a href="/billar"><span class="icon"><img src="./img/icons/categories-icon/Pool.svg" alt="Billar-icon">
        </span>
        Billar</a>
    </li>
    <li>
      <a href="/cartas"><span class="icon"><img src="./img/icons/categories-icon/Card.svg" alt="Cards-icon">
        </span>
        Cartas</a>
    </li>
    <li>
      <a href="/casual"><span class="icon"><img src="./img/icons/categories-icon/Casual.svg" alt="Casual-icon">
        </span>
        Casual</a>
    </li>
    <li>
      <a href="/click"><span class="icon"><img src="./img/icons/categories-icon/Clicker.svg" alt="Clicker-icon">
        </span>
        Click</a>
    </li>
    <li>
      <a href="/autos"><span class="icon"><img src="./img/icons/categories-icon/Car.svg" alt="Car-icon">
        </span>
        Autos</a>
    </li>
    <li>
      <a href="/conduccion"><span class="icon"><img src="./img/icons/categories-icon/Driving.svg" alt="Driving-icon">
        </span>
        Conducción</a>
    </li>
    <li>
      <a href="/control"><span class="icon"><img src="./img/icons/categories-icon/Controller.svg"alt="Controller-icon">
        </span>
        Control</a>
    </li>
    <li>
      <a href="/defensadetorres"><span class="icon"><img src="./img/icons/categories-icon/TowerDefense.svg" alt="TowerDefense-icon">
        </span>
        Defensa de torres</a>
    </li>
    <li>
      <a href="/deportes"><span class="icon"><img src="./img/icons/categories-icon/Sports.svg" alt="Sports-icon">
        </span>
        Deportes</a>
    </li>
    <li>
      <a href="/disparos"><span class="icon"><img src="./img/icons/categories-icon/Shooting.svg" alt="Shooting-icon">
        </span>
        Disparos</a>
    </li>
    <li>
      <a href="/escape"><span class="icon"><img src="./img/icons/categories-icon/Escape.svg" alt="Escaper-icon">
        </span>
        Escape</a>
    </li>
    <li>
      <a href="/flash"><span class="icon"><img src="./img/icons/categories-icon/Flash.svg" alt="Flash-icon">
        </span>
        Flash</a>
    </li>
    <li>
      <a href="/futbol"><span class="icon"><img src="./img/icons/categories-icon/Soccer.svg" alt="soccer-icon">
        </span>
        Fútbol</a>
    </li>
    <li>
      <a href="/io"><span class="icon"><img src="./img/icons/categories-icon/io.svg" alt="io-icon">
        </span>
        .io</a>
    </li>
    <li>
      <a href="/mahjong"><span class="icon"><img src="./img/icons/categories-icon/Mahjong.svg" alt="Mahjong-icon">
        </span>
        Mahjong</a>
    </li>
    <li>
      <a href="/minecraft"><span class="icon"><img src="./img/icons/categories-icon/Minecraft.svg" alt="Minecraft-icon">
        </span>
        Minecraft</a>
    </li>
    <li>
      <a href="/motos"><span class="icon"><img src="./img/icons/categories-icon/Bike.svg"alt="Bike-icon">
        </span>
        Motos</a>
    </li>
    <li>
      <a href="/puzzel"><span class="icon"><img src="./img/icons/categories-icon/Puzzle.svg"alt="Puzzle-icon">
        </span>
        Puzzle</a>
    </li>
    <li>
      <a href="/stickman"><span class="icon"><img src="./img/icons/categories-icon/Stickman.svg"alt="Stickman-icon">
        </span>
        Stickman</a>
    </li>
    <li>
      <a href="/terror"><span class="icon"><img src="./img/icons/categories-icon/Horror.svg"alt="Horror-icon">
        </span>
        Terror</a>
    </li>
    <li>
      <a href="/thinky"><span class="icon"><img src="./img/icons/categories-icon/Thinky.svg"alt="Thinky-icon">
        </span>
        Thinky</a>
    </li>
    <li>
      <a href="/etiqueta"><span class="icon"><img src="./img/icons/categories-icon/Tags.svg"alt="Tags-icon">
        </span>
        Etiqueta</a>
    </li>
  </ul>
</div>
    `;

  document.getElementById("sidebar-container").innerHTML = sidebarHTML;
  initializeSidebar();
}

function initializeSidebar() {
  // Configurar el botón del menú hamburguesa
  const menuHamburguesa = document.getElementById("menu-hamburguesa");
  const menuToggle = document.getElementById("menu-toggle");
  const overlay = document.querySelector(".overlay");

  if (menuHamburguesa && menuToggle) {
    menuHamburguesa.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      menuToggle.checked = !menuToggle.checked;
    });
  }

  if (overlay && menuToggle) {
    overlay.addEventListener("click", function () {
      menuToggle.checked = false;
    });
  }

  // Cerrar sidebar al hacer clic en un enlace del sidebar
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (menuToggle) {
        menuToggle.checked = false;
      }
    });
  });

  // También cerrar al hacer clic fuera del sidebar
  document.addEventListener("click", function (e) {
    if (menuToggle && menuToggle.checked) {
      const sidebar = document.querySelector(".sidebar");
      const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
      const isClickOnHamburger =
        menuHamburguesa && menuHamburguesa.contains(e.target);

      if (!isClickInsideSidebar && !isClickOnHamburger) {
        menuToggle.checked = false;
      }
    }
  });
}
