import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/** fire */
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AutenticationService } from './servicios/autentication.service';
import { ComponentesModule } from './componentes/componentes.module';
import { LoadingService } from './servicios/loading.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginPage } from './paginas/auth/login/login.page';
import { RegistrationPage } from './paginas/auth/registration/registration.page';
import { DashboardPage } from './paginas/auth/dashboard/dashboard.page';
import { IonicStorageModule } from '@ionic/storage';

import { Facebook } from '@ionic-native/facebook/ngx';
import { FacebookService } from './servicios/facebook.service';
import { UploadfileService } from './servicios/uploadfile.service';
import { ValidationsService } from './servicios/validations.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
// import { CroppieModule } from 'ng-croppie';
// import { Camera } from '@ionic-native/camera/ngx';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';


import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SortPipe } from './pipes/sort.pipe';

// telefono input text
import { TextMaskModule } from 'angular2-text-mask';

// Import ionic-rating module
import { IonicRatingModule } from 'ionic4-rating';
import { CalificacionPage } from './paginas/calificacion/calificacion.page';
import { CalificacionPageRoutingModule } from './paginas/calificacion/calificacion-routing.module';


@NgModule({
  declarations: [
            AppComponent,
            SortPipe,
          ],
  entryComponents: [DashboardPage],
  imports: [
      IonicRatingModule, // Put ionic-rating module here
      BrowserModule,
      ComponentesModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      HttpClientModule,
      // IonicStorageModule.forRoot(),
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFireStorageModule,
      TextMaskModule ,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AutenticationService,
    LoadingService,
    ImagePicker,
    ImageResizer,
    Camera,
    Crop,
    File,
    UploadfileService,
    ValidationsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
