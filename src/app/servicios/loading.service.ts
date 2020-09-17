import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AlertasService } from './alertas.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present(mensaje) {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
      message: mensaje,
      spinner: 'bubbles'
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
      this.isLoading = false;
      return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }


}
