class Tablero {
    constructor() {
        this.backgroundImage = new Image();
        this.backgroundImage.src = "img/imgPeg/tablero.png";
        this.loaded = false;
        this.fichas = [];

        this.backgroundImage.onload = () => {
            this.loaded = true;
        };
    }

    agregarFicha(ficha) {
        this.fichas.push(ficha);
    }

    getFichas() {
        return this.fichas;
    }
}
// --- Inicialización ---
document.addEventListener("DOMContentLoaded", function () {
    const tablero = new Tablero();

    tablero.backgroundImage.onload = () => {
        const tableroVista = new TableroVista("canvasPeg", tablero);

        // Dibujar el tablero vacío
        tableroVista.draw();

        const posiciones = tableroVista.generarPosicionesCruz();
        const radioFicha = 40; // Radio para la detección
        console.log(posiciones)

        // creo las 32 fichas
        posiciones.forEach((pos, i) => {
            const ficha = new Ficha(pos.x, pos.y, "img/imgPeg/lissa2.png", radioFicha, () => {
                tableroVista.draw();
            });
            tablero.agregarFicha(ficha);
        });

        tablero.getFichas()[0].setPosition(690, 80);
        tablero.getFichas()[1].setPosition(790, 80);
        tablero.getFichas()[2].setPosition(890, 80);
        tablero.getFichas()[3].setPosition(690, 180);
        tablero.getFichas()[4].setPosition(790, 180);
        tablero.getFichas()[5].setPosition(890, 180);

        tablero.getFichas()[6].setPosition(484, 280);
        tablero.getFichas()[7].setPosition(585, 280);
        tablero.getFichas()[8].setPosition(690, 280);
        tablero.getFichas()[9].setPosition(790, 280);
        tablero.getFichas()[10].setPosition(890, 280);
        tablero.getFichas()[11].setPosition(990, 280);
        tablero.getFichas()[12].setPosition(1090, 280);

        tablero.getFichas()[13].setPosition(484, 380);
        tablero.getFichas()[14].setPosition(585, 380);
        tablero.getFichas()[15].setPosition(690, 380);
        tablero.getFichas()[16].setPosition(890, 380);
        tablero.getFichas()[17].setPosition(990, 380);
        tablero.getFichas()[18].setPosition(1090, 380);

        tablero.getFichas()[19].setPosition(484, 480);
        tablero.getFichas()[20].setPosition(585, 480);
        tablero.getFichas()[21].setPosition(690, 480);
        tablero.getFichas()[22].setPosition(790, 480);
        tablero.getFichas()[23].setPosition(890, 480);
        tablero.getFichas()[24].setPosition(990, 480);
        tablero.getFichas()[25].setPosition(1090, 480);

        tablero.getFichas()[26].setPosition(690, 580);
        tablero.getFichas()[27].setPosition(790, 580);
        tablero.getFichas()[28].setPosition(890, 580);
        tablero.getFichas()[29].setPosition(690, 680);
        tablero.getFichas()[30].setPosition(790, 680);
        tablero.getFichas()[31].setPosition(890, 680);

        tableroVista.draw();

    };
});

