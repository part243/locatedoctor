import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/analytics';

@Injectable({
  providedIn: 'root'
})
export class UploadfileService {
UrlImage: '';
  constructor() {firebase.analytics().logEvent('notification_received'); }

/**
 *
 * @param archivo recibe evento tipo file
 * @param nombreArchivo nombre mas formato a almacenar ej: foto.png
 * @param carpetaPath carpeta de firebase donde se almacenaran los datos empezando de root ej: imagenes/perfil
 * @param prefijo nombre inicial para su imagen ej: profile  -> su nombre quedaria asi profile_foto.png
 */
async upload(linkbase64: any, nombreArchivo: string, carpetaPath: string, prefijo: string) {
  const storageRef = firebase.storage().ref();
  const filePathdeFB = carpetaPath + '/' + prefijo + '_' + nombreArchivo;
  const ref = storageRef.child(filePathdeFB);
  return await new Promise<any>((resolve, reject) => {
    ref.putString(linkbase64, 'data_url').then(
      res => { resolve(res); },
      err => { reject(err); }
    );
  });
}

 /**
  *
  * @param nombreArchivo nombre mas formato a almacenar ej: foto.png
  * @param carpetaPath carpeta de firebase donde se almacenaran los datos empezando de root ej: imagenes/perfil
  * @param prefijo nombre inicial para su imagen ej: profile  -> su nombre quedaria asi profile_foto.png
  */
  async getFile(nombreArchivo: string, carpetaPath: string, prefijo: string){
  const AlmacenRoot = firebase.storage().ref();
  const DirecionRuta = AlmacenRoot.child(carpetaPath + '/' + prefijo + '_' + nombreArchivo);
  return await new Promise<any>((resolve, reject) => {
    DirecionRuta.getDownloadURL().then(
      res => { resolve(res);
               this.UrlImage = res.toString();
               this.getUrl();
      },
      err => { reject(err);
      }
    );
  });
}

/**
 *
 * Obtiene url de imagen
 */
getUrl() {
  return this.UrlImage;
}

/**
 *
 * Obtiene logitipo de la aplicacion llamada logoSinText
 */
getUrlLogo() {
  console.log('entro');
  this.getFile('logoSinText.png', 'imagenes/app', 'app');
  console.log(this.getFile('logoSinText.png', 'imagenes/app', 'app'));
  console.log('paso');
  return this.UrlImage;
}

/**
 *
 * @param captureDataUrl url de carda del archivo imagen
 * @param carpetaPath  carpeta donde se va a almacenar la imagen
 * @param prefijo  nombre inicial para su imagen ej: profile  -> su nombre quedaria asi profile_photoname.png
 * @param nombreArchivo nombre mas formato a almacenar ej: foto.png
 */
async upload2(captureDataUrl: string, carpetaPath: string , prefijo: string, nombreArchivo: string) {
  const storageRef = firebase.storage().ref();
  const filePathdeFB = carpetaPath + '/' + prefijo + '_' + nombreArchivo;
  const ref = storageRef.child(filePathdeFB);
  // Create a timestamp as filename
  // const filename = Math.floor(Date.now() / 1000);
  // Create a reference to 'images/todays-date.jpg'
  return await new Promise<any>((resolve, reject) => {
      ref.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL).then(
              res => resolve(res),
              err => reject(err)
      );
  });
  // imageRef.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL)
  //   .then((snapshot) => {
  //     // Do something here when the data is succesfully uploaded!
  //     alerta
  // });
}

}
