import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { AutenticationService } from '../../servicios/autentication.service';
import { UploadfileService } from '../../servicios/uploadfile.service';
import { ValidationsService } from '../../servicios/validations.service';
import * as _ from 'lodash';
import { AlertasService } from '../../servicios/alertas.service';
import { CalificacionPage } from '../calificacion/calificacion.page'

@Component({
  selector: 'app-probando',
  templateUrl: './probando.page.html',
  styleUrls: ['./probando.page.scss'],
})
export class ProbandoPage implements OnInit {

  constructor(
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public authSrv: AutenticationService,
              public upload: UploadfileService,
              public validations: ValidationsService,
              public alerta: AlertasService,
              public modalController: ModalController
          ) { }

  ngOnInit() {
  }



removeImage() {
}






  async presentModal() {

    const modal = await this.modalController.create({
      component: CalificacionPage,
      cssClass: 'my-custom-modal-class',
      mode:'ios',
      backdropDismiss: true,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        'name': 'Dr. Alejandro Macías',
        'cedula': '1727334102',
      }
    });
    return await modal.present();
  }

  info(){
    this.navCtrl.navigateForward('/info');
  }
  dimiss(){
    this.modalController.dismiss();
  }




}
