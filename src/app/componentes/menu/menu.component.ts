import { Component, OnInit, Input, Inject } from '@angular/core';
import { MenuService } from 'src/app/servicios/menu.service';
import { ItfMenu } from 'src/app/interfaces/interfaces';
import { Observable } from 'rxjs';
import { NavController, IonMenuToggle, MenuController, ModalController } from '@ionic/angular';
import { AutenticationService } from 'src/app/servicios/autentication.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  ListaMenu: Observable<ItfMenu[]>;
  Username: string;
  logo: string;

  constructor(
              @Inject(AutenticationService) public authSrv,
              private SrvMenu: MenuService,
              private Navega: NavController,
              private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.ListaMenu = this.SrvMenu.getAllsMenu();
    this.logo = './assets/logo/app_logoSinText.png';
  }

  ObtenerDatos() {
      this.menuCtrl.enable(true);

  }

  cerraSession() {
    this.menuCtrl.enable(false);
    this.authSrv.SignOut();
  }

}
