
function filtroSepia(ctx){
    const imageData = ctx.getImageData(0,0,Imagen.width, Imagen.height);
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
}