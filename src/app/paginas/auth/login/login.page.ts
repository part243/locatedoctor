import { Component, OnInit, Inject } from '@angular/core';
import { MenuController, NavController, AlertController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators, EmailValidator } from '@angular/forms';
import { AutenticationService } from 'src/app/servicios/autentication.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/servicios/loading.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { Platform } from '@ionic/angular';
import { ValidationsService } from 'src/app/servicios/validations.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [],
})


export class LoginPage implements OnInit {
  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  valores: any;
  logo = '';
  loginfb: any;

  EmailReset = new FormGroup({
    emailR: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
  });

  validationMessages = {
    email : [
            {type: 'required', message: 'Email es requerido.'},
            {type: 'pattern', message: 'Ingrese un email válido'}
    ],
    password: [
            {type: 'required', message: 'Password es requerido.'},
            {type: 'minlength', message: 'Mínimo 6 caracteres.'}
    ]
  };
  constructor(
    public authSrv: AutenticationService,
    public router: Router,
    public loading: LoadingService,
    private menuCtrl: MenuController,
    public frmBuilder: FormBuilder,
    public alerta: AlertasService,
    private navega: NavController,
    private platform: Platform,
    public AlerCtrl: AlertController,
    public val: ValidationsService
  ) {

  }
 
  ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'login'});

    this.logo = '././assets/logo/app_logoSinText.png';
    this.menuCtrl.enable(false);
    // validamos formulario
    // this.authSrv.SignOut();
    this.validationsForm = this.frmBuilder.group({
        email: new FormControl('', Validators.compose([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9.-]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')
        ])),
        password: new FormControl('', Validators.compose([
            Validators.minLength(6),
            Validators.required
        ])),
      });
  }

/** LOGIN CON USUARIO Y CONTRASEÑA */

  logIn(values: any) {
    this.loading.present('Iniciando');
    this.authSrv.SignIn(values).then(res => {
      this.loading.dismiss();
      this.router.navigate(['/dashboard']);
    }, err => {
            this.loading.dismiss();
            if (err.code === 'auth/user-not-found') {
              this.alerta.alertaSimple('Inicio de sesión', 'Error', ' Usuario no existe');
            } else if (err.code === 'auth/wrong-password') {
              this.alerta.alertaSimple('Inicio de sesión', 'Error', ' Contraseña incorrecta');
            } else {
              this.alerta.alertaSimple('Inicio de sesión', 'Error: ' + err.code, err.message);
            }
            return false;
      });
   }

/** -------- LOGIN CON FACEBOOK -------------------------------------------------------------- */
// this.fb.login(['public_profile', 'user_friends', 'email'])
// .then((res: FacebookLoginResponse) => console.log('Logged into Facebook!', res))
// .catch(e => console.log('Error logging into Facebook', e));
// this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);

async loginFbAndroid() {

  // const res: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
  // const facebookCredential = this.authSrv.firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
  // const resConfirmed = await this.authSrv.ngFireAuth.signInWithCredential(facebookCredential);
  // const user = resConfirmed.user;
  // if ( user) {
  //   alert('si iene datos');
  // }
  // alert('login f android: ' + user.displayName );


  // this.picture = user.photoURL;
  // this.name = user.displayName;
  // this.email = user.email;


//   this.fb.login(['email', 'public_profile'])
//   .then((res: FacebookLoginResponse) => {
//     console.log('Logged into Facebook!', JSON.stringify(res));
//     this.loginfb = JSON.stringify(res);
//     alert('Login OK');
// })
// .catch(e => {
//     console.log('Error logging into Facebook', e);
//     alert('Login ERROR');
// });
}

async loginFbWeb() {
  // const res = await this.authSrv.ngFireAuth.auth.signInWithPopup(new this.authSrv.firebase.auth.FacebookAuthProvider());

  // const user = res.user;

  // console.log(user);


// const a = await this.fb.loginFb();
// console.log('respuesta', a);
// console.log('userfb: ', this.fb.user);
  // this.picture = user.photoURL;
  // this.name = user.displayName;
  // this.email = user.email;
}

async resetear() {
  const alert = await this.AlerCtrl.create({
    header: 'Recuperar contraseña!',
    subHeader: 'Ingrese su correo electrónico',
    translucent: true,
    cssClass: 'alertCustomCss',
    mode: 'ios',
    inputs: [
      {
        name: 'emailR',
        type: 'email',
        placeholder: 'Ingrese su email'
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Recuperar',
        cssClass: 'primary',
        handler: data => {
            if (this.val.validateEmail(data.emailR).isValid) {
                this.authSrv.resetPasswordIniciar(data.emailR).then(
                  res => this.alerta.showToast('Se ha enviado un correo de recuperacion a su cuenta', 3000, 'top'),
                  err => this.alerta.showToast('Email ingresado no tiene cuenta registrada', 3000, 'top'),
                );
            } else {
                this.alerta.showToast('Email inválido', 2000, 'top');
            }
        }
      }
    ]
  });
  await alert.present();
}

  canActive() {
  }

  irInicio() {
    this.navega.navigateForward('/inicio');
  }
}
