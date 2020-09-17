import { Injectable } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {
email = '';

  constructor( private NavegaCtrl: NavController,
               private AlerCtrl: AlertController,
               public toastCtrl: ToastController) { }
/**
 *
 * @param Header Titulo del mensaje
 * @param SHeader SubTitulo del mensaje
 * @param Message Mensaje a mostrar
 */
  async alertaSimple(Header: string, SHeader: string, Message: string) {
      const alert = await this.AlerCtrl.create({
        header: Header,
        subHeader: SHeader,
        message: Message,
        buttons: ['OK']
      });
      await alert.present();
      this.NavegaCtrl.navigateBack('');
  }
  /**
   * Sin navegacion o retorno
   * @param Header 
   * @param SHeader 
   * @param Message 
   */
  async alertaSimple2(Header: string, SHeader: string, Message: string) {
    const alert = await this.AlerCtrl.create({
      header: Header,
      subHeader: SHeader,
      message: Message,
      buttons: ['OK']
    });
    await alert.present();
}
/**
 *
 * @param mensaje Mensaje a mostrar en el Toast
 * @param time Tiempo que demorará el toast
 * @param pos Posicion del toas top|bottom     texto-> left|center|right    ej: top left
 */
  async showToast(mensaje: any, time: number, post: any) {
    const t = await this.toastCtrl.create({
      message: mensaje,
      duration: time,
      position: post
    });
    t.present();
  }

}
