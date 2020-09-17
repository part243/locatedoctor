import { Component, OnInit } from '@angular/core';
import { SaveinfirebaseService } from '../../../servicios/saveinfirebase.service';
import { NavController, ModalController } from '@ionic/angular';
import { AlertasService } from '../../../servicios/alertas.service';
import { UploadfileService } from '../../../servicios/uploadfile.service';
import { FuncionesService } from '../../../servicios/funciones.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {
  cedula:'';
  UltimosComentarios: any[]=[];
  TodosComentarios: any;
  Comentarios: any;
  constructor(
    private fire: SaveinfirebaseService,
    private navCtrl: NavController,
    private alertas: AlertasService,
    private fireUp: UploadfileService,
    private fun : FuncionesService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    firebase.analytics().logEvent('page_view',{'page_title':'comentarios'});
    //{{new Date(elem.timestamp)}}     //  {{elem.timestamp | date: 'yyyy-MM-dd'}}  //   {{elem.timestamp.seconds*1000 | date}}   //  < th >{{elem.timestamp | date: 'yyyy/MM/dd h:mm:ss a'}}< /th >
    // {{elem.timestamp | date: 'yyyy/MM/dd hh:mm:ss a'}}
    // time format 24H    {{elem.timestamp | date: 'yyyy/MM/dd HH:mm:ss'}}
    let a = JSON.parse(localStorage.getItem('MedicViewMap'));
    this.cedula = a.cedula;
    
    //console.log(this.cedula);
    
    
    //console.log(new Date(parseInt(res[2].data().timestamp.seconds)));
  }
  
  async ionViewWillEnter() {
    this.get10LastComment();
  }

  /**
   * Obtiene todos los comentarios
   */
  getAllsComment(){
    this.UltimosComentarios=[];
    this.fire.getAllsComentarios(this.cedula,'asc').then(
      res=>{
        setTimeout(() => {
          this.UltimosComentarios = res;
          this.getPhotoProfile(this.UltimosComentarios);
        }, 2500);
      }
    );

  }

  /**
   * Obtiene los ultimos 10 comentarios
   */
 get10LastComment(){
   this.TodosComentarios = '';
   
   this.fire.getComentarios(this.cedula,10,'desc').then(
    res=>{
      this.UltimosComentarios = res;
      console.log(res);
      this.getPhotoProfile(this.UltimosComentarios);
    },
    err =>console.log(err)
  );
 }

 getPhotoProfile(array: any){
   array.forEach((item, index)=> {
      setTimeout(() => {
          this.fireUp.getFile(item.data().de,'imagenes/perfil','profile').then(
            res=>{
            Object.assign(this.UltimosComentarios[index],{'foto':res});
            },
            err=>{
            Object.assign(this.UltimosComentarios[index],{'foto':'https://firebasestorage.googleapis.com/v0/b/locatedoctor-badda.appspot.com/o/imagenes%2Fapp%2Fapp_logoSinText.png?alt=media&token=88fc4841-ac07-49ec-b4a2-fa0b293c879a'});
            }
          )
        }, 2500);
      });

 }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
