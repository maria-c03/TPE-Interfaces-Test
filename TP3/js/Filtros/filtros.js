
function filtroBrillo(ctx, iniX, iniY, w, h){
    
    const imageData = ctx.getImageData(iniX,iniY, w, h);
    const data = imageData.data;

    // aplicamos un 70 de reducion de color en cada uno de los valores

    for (let i = 0; i < data.length; i += 4) {
        // Ajustar cada componente de color (R, G, B)
        data[i] = data[i] * 0.3;     // Rojo
        data[i + 1] = data[i + 1] * 0.3; // Verde
        data[i + 2] = data[i + 2] * 0.3;
    }

    ctx.putImageData(imageData, iniX, iniY);
    
}

function filtroSepia(ctx, iniX, iniY, w, h){
    const imageData = ctx.getImageData(iniX,iniY, w, h);
    const data = imageData.data;
    
    for(let i= 0; i < data.length - 1; i += 4){

        const rojo = data[i];
        const green = data[i+1];
        const blue = data[i+2];

        //Calculo para tono sepia (Internet) supuestos valores.
        const sepiaRed = ((rojo *0.393) + (green * 0.769) + (blue * 0.189));
        const sepiaGreen =((rojo*0.349) + (green*0.686) + (blue*0.168));
        const sepiaBlue =((rojo * 0.272) + (green * 0.534) + (blue * 0.131));

        // Agrego tono por pixel para filtro sepia
        data[i] = sepiaRed;
        data[i+1] = sepiaGreen;
        data[i+2] = sepiaBlue;
    }
     ctx.putImageData(imageData, iniX, iniY);
}

function filtroNegativo(ctx, iniX, iniY, w, h){
    const imageData = ctx.getImageData(iniX,iniY, w, h);
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
     ctx.putImageData(imageData, iniX, iniY);
}


function filtroGrices(ctx, iniX, iniY, w, h){

    const imageData = ctx.getImageData(iniX,iniY, w, h);
    const data = imageData.data;
    
    for(let i = 0; i < data.length - 1; i +=4 ){

    // Segun BT.601 calculamos los grices para mas espefiquidad
    const avg = (data[i]*0.299 + data[i+1]*0.587 + data[i+2]*0.114) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

     ctx.putImageData(imageData, iniX, iniY);
}