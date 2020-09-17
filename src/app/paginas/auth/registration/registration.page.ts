import { Component, OnInit, Inject } from '@angular/core';
import { AutenticationService } from '../../../servicios/autentication.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../servicios/loading.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MenuController, AlertController, NavController } from '@ionic/angular';
import { AlertasService } from '../../../servicios/alertas.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  valores: any;
  logo = '';

  validationMessages = {
    email : [
            {type: 'required', message: 'Email es requerido.'},
            {type: 'pattern', message: 'Ingrese un email válido'}
    ],
    password: [
            {type: 'required', message: 'Password es requerido.'},
            {type: 'minlength', message: 'Mínimo 6 caracteres.'}
    ],
    nombre: [
            {type: 'required', message: 'Ingrese un nombre.'},
            {type: 'minlength', message: 'Escriba un nombre válido'}
    ]
  };

  constructor(
          @Inject(AutenticationService) public authSrv,
          public router: Router,
          public loading: LoadingService,
          private menuCtrl: MenuController,
          public frmBuilder: FormBuilder,
          public alert: AlertasService,
          private navega: NavController
  ) { }

  ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'register'});
    this.logo = '././assets/logo/app_logoSinText.png';
    this.menuCtrl.enable(false);
    // validamos formulario
    this.validationsForm = this.frmBuilder.group({
        email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')
        ])),
        password: new FormControl('', Validators.compose([
            Validators.minLength(6),
            Validators.required
        ])),
        nombre: new FormControl('', Validators.compose([
          Validators.minLength(2),
          Validators.required
        ])),
      });
  }

  signUp(values) {
    this.loading.present('Guardando..');
    this.authSrv.registerUser(values).then(res => {
      this.loading.dismiss();
      this.loading.present('Iniciando...');
      this.authSrv.SignIn(values).then(() => {
        setTimeout(() => {
          this.loading.dismiss();
          this.navega.navigateForward(['/dashboard']);
          this.alert.alertaSimple('Registro de usuario', 'Saludos ' + values.nombre,
          'Su cuenta ha sido creada, mas adelante puede verificar su email.');
        }, 4000);
      }, err => {console.log(err); this.loading.dismiss(); });
    }, err => {
              this.loading.dismiss();
              if (err.code === 'auth/email-already-in-use') {
                this.alert.alertaSimple('Registro de usuario', 'Error', 'El email ingresado ya tiene cuenta registrada');
              }
              this.navega.navigateForward(['/registration']);
        });
  }

  irInicio() {
    this.navega.navigateForward('/inicio');
  }
}
