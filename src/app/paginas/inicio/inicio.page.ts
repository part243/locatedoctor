import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AutenticationService } from 'src/app/servicios/autentication.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(
    private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('first_ini',{'page_title':'ini_app'});
    this.menuCtrl.enable(false);
 }

}
