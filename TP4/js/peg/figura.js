class Figura {
    //clase desarrollada con el material povisto por la catedra
    constructor(posX, posY, fill, context) {
        this.posX = posX;
        this.posY = posY;
        this.fill = fill;
        this.ctx = context;
    }

    setFill(fill) {
        this.fill = fill;
    }

    //cuando lo muevo le cambio su pos a una nueva
    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }

    getPosition() { // devuelve un json con las coord x,y
        return {
            x: this.getPosX(),
            y: this.getPosY()
        }
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    getFill() {
        return this.fill;
    }

    isPointInside(x, y) { }; //metodo abstracto que indica si el mouse esta dentro de la figura

} 