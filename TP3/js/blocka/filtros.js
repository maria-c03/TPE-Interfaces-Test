class Filtros {
  constructor(ctx) {
    this.ctx = ctx;
  }

  brillo(iniX, iniY, w, h) {
    const imageData = this.ctx.getImageData(iniX, iniY, w, h);
    const data = imageData.data;
    const factor = 0.3;
    for (let i = 0; i < data.length; i += 4) {
      data[i] *= factor;     // Rojo
      data[i + 1] *= factor; // Verde
      data[i + 2] *= factor; // Azul
    }

    this.ctx.putImageData(imageData, iniX, iniY);
  }

  sepia(iniX, iniY, w, h) {
    const imageData = this.ctx.getImageData(iniX, iniY, w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i]     = (r * 0.393) + (g * 0.769) + (b * 0.189);
      data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
      data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
    }

    this.ctx.putImageData(imageData, iniX, iniY);
  }

  negativo(iniX, iniY, w, h) {
    const imageData = this.ctx.getImageData(iniX, iniY, w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i]     = 255 - data[i];     // Rojo
      data[i + 1] = 255 - data[i + 1]; // Verde
      data[i + 2] = 255 - data[i + 2]; // Azul
    }

    this.ctx.putImageData(imageData, iniX, iniY);
  }

  grices(iniX, iniY, w, h) {
    const imageData = this.ctx.getImageData(iniX, iniY, w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      data[i] = data[i + 1] = data[i + 2] = avg;
    }

    this.ctx.putImageData(imageData, iniX, iniY);
  }
}
