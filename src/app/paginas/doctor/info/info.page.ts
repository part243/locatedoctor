import { Component, OnInit } from '@angular/core';
import { SaveinfirebaseService } from '../../../servicios/saveinfirebase.service';
import { NavController, ModalController } from '@ionic/angular';
import { AlertasService } from '../../../servicios/alertas.service';
import { datosMedicos } from '../../../interfaces/interfaces';
import { UploadfileService } from '../../../servicios/uploadfile.service';
import { FuncionesService } from '../../../servicios/funciones.service';
import { ComentariosPage } from '../../doctor/comentarios/comentarios.page';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  DatosMedico: datosMedicos[] =[];
  diasatencion: any;
  datosCargados:boolean = false;
  constructor(private fire: SaveinfirebaseService,
              private navCtrl: NavController,
              private alertas: AlertasService,
              private fireUp: UploadfileService,
              private fun : FuncionesService,
              public modalController: ModalController
    ) { }

  async ngOnInit() {
    firebase.analytics().logEvent('page_view',{'page_title':'infoMedic'});
    this.datosCargados = false;
    try {
      if(JSON.parse(localStorage.getItem('MedicViewMap')).nombre){
        this.DatosMedico.push(JSON.parse(localStorage.getItem('MedicViewMap')));
        await this.fire.getPais(this.DatosMedico[0].paisorigen).then(
          res=> {
            this.DatosMedico[0].paisorigen = res.docs[0].data().name;
            setTimeout(() => {
              this.datosCargados = true;
            }, 1500);
          },
          err=>console.log(err),
        );
      }else{
        this.alertas.showToast('No se puede obtener datos del médico',1000,'top');
        this.dismiss();
      }
    } catch (error) {
      this.alertas.showToast('No se puede obtener datos del médico',1000,'top');
      this.dismiss();
    }


    
    
  }

  async ionViewWillEnter() {

    
                                            //1727334102
                                            //803487453
   /*  await this.fire.getIdfromAnyDocument('1727334102').then(
       res => {
         if(res.length > 0){
             this.DatosMedico.push(res[0].data());
             this.fireUp.getFile(res[0].id,'imagenes/perfil','profile').then(
               res => {
                 //DATOS CON FOTOIONIC
                 setTimeout(() => {
                  this.DatosMedico[0].foto = res; 
                 }, 2000);
                 
                 //Object.assign(this.lstBusqueda[x],{'distancia':d});
                 console.log(res)},
               err => console.log(err)
             );
             //OBTIENE LOS DIAS DE ATENCION
             setTimeout(() => {
               this.diasatencion = this.fun.DiasAtencion(this.DatosMedico[0].diaatencion);
             }, 1000);


             console.log(this.DatosMedico);
         }else{
           this.alertas.showToast('No se puede obtener información del mpedico',1000,'top');
           this.navCtrl.navigateForward('/dashboard');
         }
       }, err => {console.log(err)}
     );
     localStorage.setItem('MedicViewMap', JSON.stringify(this.DatosMedico));*/


  }
  async ViewComments(){
    const modal = await this.modalController.create({
      component: ComentariosPage,
      cssClass: 'my-custom-mogdal-class',
      mode:'ios',
      backdropDismiss: true,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
      }
    });
    return await modal.present();

  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
