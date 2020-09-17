import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, AlertController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AutenticationService } from 'src/app/servicios/autentication.service';
import {takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlertasService } from 'src/app/servicios/alertas.service';
// import { UserManagementActions } from 'src/app/servicios/enums.service';


@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage implements OnInit {
  logo = '';
  ngUnsubscribe: Subject<any> = new Subject<any>();
  actions = [
    {}
  ];

  // The user management actoin to be completed
  mode: string;
  // Just a code Firebase uses to prove that
  // this is a real password reset.
  actionCode: string;

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  actionCodeChecked: boolean;
  email: string;

  constructor(
        private menuCtrl: MenuController,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authSrv: AutenticationService,
        private alertController: AlertController,
        private navega: NavController,
        private alerta: AlertasService
        ) { }

  ngOnInit() {
    this.logo = '././assets/logo/app_logoSinText.png';
    this.menuCtrl.enable(false);
    this.activatedRoute.queryParams.pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(params => {
              // si no hay parametros retornamos al login
              if (!params) { this.router.navigate(['']); }
              // si hay parametros seguimos
              this.mode = params.mode;
              this.actionCode = params.oobCode;
              if (this.mode === 'resetPassword') {
                // verificamossi el codigo de reset es correcto
                this.authSrv.getAuth().verifyPasswordResetCode(this.actionCode).then(
                  email => { this.actionCodeChecked = true;
                  }).catch (
                    e => {
                      // tslint:disable-next-line:max-line-length
                      this.mensajeAlert('Recuperar contraseña', '' , 'Codigo inválido o expirado, por favor repita el proceso de recuperar contraseña.');
                      this.router.navigate(['']);
                    });
              }
              
              if (this.mode === 'verifyEmail') {
                console.log('verificando email');
                this.authSrv.getAuth().applyActionCode(this.actionCode).then(()=> {console.log('hecho');});
                this.alerta.alertaSimple('Verificando email','','Su email ha sido verificado, cierre y vuelva a iniciar sesión.')
                this.router.navigate(['']);
              }

              //else { this.navega.navigateForward(''); }
            });
  }

  ngOndestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

/*
 * cuando el usuario confirma el reseteo del password
 */
handleResetPassword() {
  if (this.newPassword !== this.confirmPassword) {
    this.mensajeAlert('Recuperar contraseña', '', 'Los password ingresados no coinciden');
    return;
  }

  // guarda el password en firebase

  this.authSrv.getAuth().confirmPasswordReset(
    this.actionCode,
    this.newPassword
  ).then( resp => {
    this.mensajeAlert('Recuperar contraseña', '', 'Su password ha sido modificado exitosamente');
    this.router.navigate(['']);
  }).catch( e => {
    this.mensajeAlert('Recuperar contraseña', '' , 'Codigo inválido o expirado, por favor repita el proceso de recuperar contraseña.');
  });
}


  async mensajeAlert(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

}
