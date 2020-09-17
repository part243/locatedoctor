import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { AlertasService } from './alertas.service';

@Injectable()
export class FacebookService {

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public loading: LoadingService,
    public alerta: AlertasService,
    public fb: Facebook
  ) { }
user: any;

 async loginFb() {
  return await this.fb.login(['public_profile', 'email'])
                      .then((res: FacebookLoginResponse) => this.getUserFBInfo(res.authResponse.userID))
  .catch(e => console.log(e));
 }

 async getUserFBInfo(userId: string) {
  await this.fb.api('me?fields=' + ['name', 'email', 'first_name', 'last_name', 'picture.type(large)'].join(), null)
            .then((res: any) => this.setFacebookUserInfo(res))
  .catch(e => console.log(e));
 }

 setFacebookUserInfo(user: any) {
    this.user = user;
  }

}
