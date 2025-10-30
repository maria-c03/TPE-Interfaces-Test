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
        const radio = Math.min(tableroVista.width / 7, tableroVista.height / 7);
        console.log(posiciones)

        // creo las 32 fichas
        posiciones.forEach((pos, i) => {
            const ficha = new Ficha(pos.x, pos.y, "img/imgPeg/homer.png", radio, () => {
                tableroVista.draw();
            });
            tablero.agregarFicha(ficha);
        });

        tablero.getFichas()[0].setPosition(688, 78);
        tablero.getFichas()[1].setPosition(788, 78);
        tablero.getFichas()[2].setPosition(888, 78);
        tablero.getFichas()[3].setPosition(688, 179);
        tablero.getFichas()[4].setPosition(788, 179);
        tablero.getFichas()[5].setPosition(888, 179);

        tablero.getFichas()[6].setPosition(486, 280);
        tablero.getFichas()[7].setPosition(586, 280);
        tablero.getFichas()[8].setPosition(687, 280);
        tablero.getFichas()[9].setPosition(787, 280);
        tablero.getFichas()[10].setPosition(888, 280);
        tablero.getFichas()[11].setPosition(988, 280);
        tablero.getFichas()[12].setPosition(1089, 280);

        tablero.getFichas()[13].setPosition(486, 380);
        tablero.getFichas()[14].setPosition(586, 380);
        tablero.getFichas()[15].setPosition(687, 380);
        tablero.getFichas()[16].setPosition(888, 380);
        tablero.getFichas()[17].setPosition(988, 380);
        tablero.getFichas()[18].setPosition(1089, 380);

        tablero.getFichas()[19].setPosition(486, 481);
        tablero.getFichas()[20].setPosition(586, 481);
        tablero.getFichas()[21].setPosition(687, 481);
        tablero.getFichas()[22].setPosition(787, 481);
        tablero.getFichas()[23].setPosition(888, 481);
        tablero.getFichas()[24].setPosition(988, 481);
        tablero.getFichas()[25].setPosition(1089, 481);

        tablero.getFichas()[26].setPosition(688, 582);
        tablero.getFichas()[27].setPosition(788, 582);
        tablero.getFichas()[28].setPosition(888, 582);
        tablero.getFichas()[29].setPosition(688, 683);
        tablero.getFichas()[30].setPosition(788, 683);
        tablero.getFichas()[31].setPosition(888, 683);
        
        tableroVista.draw();
    };
});

