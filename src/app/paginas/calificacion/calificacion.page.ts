import { Component, OnInit, Input } from '@angular/core';
import { NavController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { SaveinfirebaseService } from '../../servicios/saveinfirebase.service';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.page.html',
  styleUrls: ['./calificacion.page.scss'],
})
export class CalificacionPage implements OnInit {
  @Input() name: string;
  @Input() cedula: string;
  comentario = "";
  rate: number = 0;
  idStar = "";
  idComment="";
  constructor(public nav: NavController, public modalController: ModalController, public fire: SaveinfirebaseService) { }

  ngOnInit() {
    
    this.onLoad();
    
  }
  logRatingChange(ev: any){


  }

  async onLoad(){
    await this.fire.getCommentFromuser(this.cedula).then(
      res => {
        if(res.length <= 0){
          this.rate = 0;
          this.comentario = "";
        }else{
          //obtenemos calificacion realizada
          this.comentario = res[0].data().texto; //obtenemos comentario realizado con anterioridad
          console.log(res[0].data().timestamp);
          this.idComment = res[0].id;
          //console.log(res[0].texto);
          this.fire.getStarFromuser(this.cedula).then(res => {
            if(res.length > 0){
              this.idStar = res[0].id;
              this.rate = res[0].data().calificacion;
            }
          }, err => {console.log(err)});
        }
        },
      res => {
        console.log(res);
      }
    );
    console.log(this.rate);
  }

  onEnviar(){
    if(this.idComment == ""){
      this.idComment = this.makeid(20);
    }
    if(this.idStar == ""){
      this.idComment = this.makeid(20);
    }
    this.fire.setStarAndComment(this.idComment,this.idComment,this.comentario,this.rate,this.cedula);
    this.dismiss();
  }

  makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
