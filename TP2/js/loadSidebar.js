// js/loadSidebar.js
document.addEventListener("DOMContentLoaded", () => {
fetch("./sidebar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo sidebar.html");
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("sidebar-placeholder").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error al cargar la barra lateral:", error);
    });
});
