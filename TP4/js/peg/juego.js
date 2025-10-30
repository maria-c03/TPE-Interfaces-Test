let canvas = document.querySelector("#canvasPeg");
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;


let figures = [];
let lastClickedFigure = null;
let isMouseDown = false;


class Juego {

}

function drawFigure(){
    clearCanvas();
    for (let i = 0; i< figures.length; i++){
        figures[i].draw();
    }
}
function findClickedFigure(x, y) {
    for (let i = 0; i < figures.length; i++) {
        const element = figures[i];
        if (element.isPointInside(x, y)) {
            return element;
        }
    }
}

function onMouseDown(e) {
    isMouseDown = true;
    //si tenia una fig selec y clickeo en otro lado la desresalto
    if (lastClickedFigure != null) {
        lastClickedFigure.setResaltado(false);
        lastClickedFigure = null;
    }

    let clickFig = findClickedFigure(e.layerX, e.layerY);//coord x e y dentro del canvas
    if (clickFig != null) {
        clickFig.setResaltado(true);
        lastClickedFigure = clickFig;
    }
    drawFigure();
}

function onMouseMove(e){
    if(isMouseDown && lastClickedFigure != null){
        lastClickedFigure.setPosition(e.layerX, e.layerY);
        drawFigure();
    }
}

function onMouseUp(e){
    isMouseDown = false;
}
//eventos del mouse
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
canvas.addEventListener("mousemove", onMouseMove, false);
