
function filtroNegativo(ctx){
    const imageData = ctx.getImageData(0,0,Imagen.width, Imagen.height);
    const data = imageData.data;

    for(let i= 0; i < data.length - 1; i += 4){

        // Invertimos valores para dar negativo (maximo posible - valor)= valor invertido.
        const red = data [i] = 255 - data[i];
        const green = data [i+1] = 255 -data[i+1];
        const blue = data[i+2] = 255- data[i+2]; 
        
        //Asignamos valores.
        data[i]= red;
        data[i+1] = green;
        data[i+2] = blue;
    }
}