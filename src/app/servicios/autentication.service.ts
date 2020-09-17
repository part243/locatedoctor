import { Injectable, NgZone } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { NavController } from '@ionic/angular';
import { User } from '../interfaces/interfaces';
import { LoadingService } from './loading.service';
import { AlertasService } from './alertas.service';
import { Storage } from '@ionic/storage';


@Injectable({providedIn: 'root'})
export class AutenticationService {
  userData: User;
  constructor(
    public afStore: AngularFireStorage,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public loading: LoadingService,
    public alerta: AlertasService,
  ) {
    firebase.analytics().logEvent('notification_received');
    this.Verficiacion();
  }

  // Login in with email/password
  async SignIn(values) {
    //google analitico
    firebase.analytics().logEvent('login',{method:'email'});
    return  await this.ngFireAuth.signInWithEmailAndPassword(values.email, values.password);
  }

  async Verficiacion() {
    await this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        console.log('Servicio: ', user);
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }
/**
 *
 * @param newPass recibe el password par actualizar
 */
  async updatePassword(newPass: string) {
    //google analitico
    firebase.analytics().logEvent('update_pass',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    const usuario = await this.ngFireAuth.currentUser;
    return await new Promise<any>((resolve, reject) => {
      usuario.updatePassword(newPass).then(res => {resolve(res); }, err => {reject(err); });
    });
  }



/**
 * 
 * @param nombre Nuevo Nombre
 */
  async updateName(nombre: string) {
    //google analitico
    firebase.analytics().logEvent('update_name',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    const user = await this.ngFireAuth.currentUser;
    return await new Promise<any>((resolve, reject) => {
      user.updateProfile({displayName: nombre}).then(res => {resolve(res);} , err => {reject(err);});
    });
  }




  // Register user with email/password
   async registerUser(values) {
    //google analitico
    firebase.analytics().logEvent('sign_up',{'user_id':values.email.toLowerCase()});
     return await new Promise<any>((resolve, reject) => {
       this.ngFireAuth.createUserWithEmailAndPassword(values.email.toLowerCase(), values.password).then(
         res => {
           resolve (res);
           res.user.updateProfile({displayName: values.nombre}).then(() => {
                      // console.log('nombre actualizado');
                      setTimeout(() => {
                        this.Verficiacion();
                      }, 2000);
                    });
                 },
         err => {reject(err);
               // this.alerta.alertaSimple('Registro de usuario', err.code, err.message);
            });
     });
  }

  // Email verification when new user register
  async SendVerificationMail() {
    //google analitico
    firebase.analytics().logEvent('email_verification',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    return (await this.ngFireAuth.currentUser).sendEmailVerification()
    .then(() => {
     // this.router.navigate(['verify-email']);
    }, err => console.log('error email'));
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  /**
   * Inicializa el proceso del reseteo de password para este usuario
   * @param email email of the user
   */
  resetPasswordIniciar(email: string) {
    //google analitico
    firebase.analytics().logEvent('reset_pass',{'user_id':email});
        return firebase.auth().sendPasswordResetEmail(
      email,
      {url: 'http://localhost:8100/auth'} // url a la que va a tener acceso el usuario de reseteo
    );
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }



  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  getAuth() {
    return firebase.auth();
  }
  // Auth providers
  AuthLogin(provider) {
    // return this.ngFireAuth.signInWithPopup(provider)
    // .then((result) => {
    //    this.ngZone.run(() => {
    //       this.router.navigate(['dashboard']);
    //     });
    //    this.SetUserData(result.user);
    // }).catch((error) => {
    //   window.alert(error);
    // });
  }

  // Store user in localStorage
  SetUserData(user) {
    // const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    // const userData: User = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName,
    //   photoURL: user.photoURL,
    //   emailVerified: user.emailVerified
    // };
    // return userRef.set(userData, {
    //   merge: true
    // });
  }

  // Sign-out
  async SignOut() {
    //google analitico
    firebase.analytics().logEvent('LogOut',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    this.loading.present('Cerrando...');
    return  await this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('fotoUrl');
      localStorage.removeItem('user');
      localStorage.removeItem('myubicacion');
      localStorage.removeItem('datosmedicos');
      localStorage.removeItem('AUXdatosmedicos');
      localStorage.removeItem('especialidades');
      setTimeout(() => {
        this.loading.dismiss();
        this.router.navigate(['/login']);
      }, 2000);
      console.log('sesion cerrada');
    });
  }

  // userData: any;
  // constructor(
  //         public afStore: AngularFirestore,
  //         public fireAuth: AngularFireAuth,
  //         public router: Router,
  //         public ngZone: NgZone,
  //         private Navega: NavController
  // ) {
  //   // capturamos si ha inicado sesion
  //   this.fireAuth.authState.subscribe(user => {
  //     if (user) {
  //       console.log(user);
  //       this.userData = user;
  //       localStorage.setItem('user', JSON.stringify(this.userData));
  //       JSON.parse(localStorage.getItem('user'));
  //     } else {
  //       localStorage.setItem('user', null);
  //       JSON.parse(localStorage.getItem('user'));
  //     }
  //   });
  // }



  // // registro de usuario // email, password, photoURL
  // registerUser(values: any) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.fireAuth.createUserWithEmailAndPassword(values.email.toLowerCase(), values.password).then(
  //       res => {
  //         resolve (res);
  //         res.user.updateProfile({displayName: values.nombre});
  //               },
  //       err => reject(err));
  //   });
  // }
  // // inicia sesion
  // SignIn(values: any) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.fireAuth.signInWithEmailAndPassword(values.email.toLowerCase(), values.password).then(
  //       res => {
  //         resolve (res);
  //       },
  //       err => reject(err));
  //   });
  // }

  // // verficia inicio de sesion
  // isLoggedIn() {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   return (user !== null ) ? true : false;
  // }

  //   // Sign-out
  //   SignOut() {
  //     return this.fireAuth.signOut().then(() => {
  //       localStorage.removeItem('user');
  //       this.router.navigate(['login']);
  //       console.log('sesion cerrada');
  //     });
  //   }
}
