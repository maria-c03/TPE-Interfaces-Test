// ----------INICIALIZACION DEL JUEGO-----------
document.addEventListener("DOMContentLoaded", function () {
    const pegModel = new PegModel(); // 1. MODELO

    // Esperar a que el fondo del tablero cargue antes de crear la Vista y el Controlador
    pegModel.backgroundImage.onload = () => {
        const pegVista = new PegVista("canvasPeg", pegModel); // 2. VISTA
        const pegController = new PegController(pegModel, pegVista); // 3. CONTROLADOR
    };
});