import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }
/**
 *
 * @param data captura el email para su validacion
 */
  validateEmail(data: string) {
    const emailRex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ( emailRex.test(data)) {
      return {
        isValid: true,
        message: 'Válido'
      };
    } else {
       return {
          isValid: false,
          message: 'inválido'
       };
    }
  }

  /**
   * Comprime un imagen en formato base64, devuelve una promesa con data como resultado nueva url base64
   * @param src url de la imagenen formato base64
   * @param newX nueva dimensión X
   * @param newY nueva dimensión Y
   */
  compressImage(src: string, newX: number, newY: number) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        resolve(data);
      };
      img.onerror = error => reject(error);
    });
  }

}
