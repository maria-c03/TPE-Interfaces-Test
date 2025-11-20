document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("bestScore")) {
        document.getElementById("bestScoreLabel").innerText = localStorage.getItem("bestScore");
    }
    document.getElementById("btnStart").addEventListener("click", () => {
        document.getElementById("startModal").classList.add("hide");
        document.getElementById("startModal").classList.remove("show");

        game = new FlappyGame("canvas");
        game.animate();
        game.startTimer();
    });

    document.getElementById("btnRestart").addEventListener("click", () => {
        document.getElementById("gameOverModal").classList.add("hide");
         location.reload();
    });
    
    const btnInstructions = document.getElementById("btnInstructions");
    const instructionsModal = document.getElementById("instructionsModal");
    const closeBtn = document.getElementById("closeInstructions");

    btnInstructions.addEventListener("click", () => {
        instructionsModal.classList.remove("hide");
    });

    closeBtn.addEventListener("click", () => {
        instructionsModal.classList.add("hide");
    });

    // Cerrar al hacer click fuera del contenido
    instructionsModal.addEventListener("click", (e) => {
        if (e.target === instructionsModal) {
            instructionsModal.classList.add("hide");
        }
    });
});
