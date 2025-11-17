document.addEventListener("DOMContentLoaded", function () {
    const pegModel = new PegModel(); 
    pegModel.backgroundImage.onload = () => {
        const pegVista = new PegVista("canvasPeg", pegModel);
        const pegController = new PegController(pegModel, pegVista);
    };
});