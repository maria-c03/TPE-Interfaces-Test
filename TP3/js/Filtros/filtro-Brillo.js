
function filtroBrillo(ctx){
    
    const imageData = ctx.getImageData(0,0,Imagen.width, Imagen.height);
    const data = imageData.data;

    // aplicamos un 70 de reducion de color en cada uno de los valores

    for (let i = 0; i < data.length; i += 4) {
        // Ajustar cada componente de color (R, G, B)
        data[i] = data[i] * 0.3;     // Rojo
        data[i + 1] = data[i + 1] * 0.3; // Verde
        data[i + 2] = data[i + 2] * 0.3;
    }
}