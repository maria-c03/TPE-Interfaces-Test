
function filtroGrices(ctx){

    const imageData = ctx.getImageData(0,0,Imagen.width, Imagen.height);
    const data = imageData.data;
    
    for(let i = 0; i < data.length - 1; i +=4 ){

    // Segun BT.601 calculamos los grices para mas espefiquidad
    const avg = (data[i]*0.299 + data[i+1]*0.587 + data[i+2]*0.114) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
}