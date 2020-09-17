import { Component, OnInit, Input, Inject, NgZone, ElementRef } from '@angular/core';
import { AutenticationService } from '../../../servicios/autentication.service';
import { MenuController, NavController,ModalController } from '@ionic/angular';
import { User } from 'src/app/interfaces/interfaces';
import { LoadingService } from 'src/app/servicios/loading.service';
import { LoginPage } from '../login/login.page';
import { UploadfileService } from 'src/app/servicios/uploadfile.service';
import {
  GoogleMapsEvent,
} from '@ionic-native/google-maps';


import { Platform, ToastController, LoadingController} from '@ionic/angular';
import { GoogleMaps, MarkerOptions, GoogleMap, Marker, MarkerCluster, GoogleMapOptions, HtmlInfoWindow, MyLocation, LatLng, GoogleMapsAnimation, GeocoderRequest, Geocoder } from '@ionic-native/google-maps/ngx';
import {Environment} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from 'src/app/servicios/alertas.service';
import * as firebase from 'firebase/app';
import { forEach } from 'core-js/fn/array';
import { SaveinfirebaseService } from 'src/app/servicios/saveinfirebase.service';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { google } from 'google-maps';


import { CalificacionPage } from '../../calificacion/calificacion.page'
import { InfoPage } from '../../doctor/info/info.page'
import { ComentariosPage } from '../../doctor/comentarios/comentarios.page';

declare var google: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  providers: [],
})

export class DashboardPage implements OnInit {
Username: any = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  emailVerified: ''
};
datosVerificados = false;
Nombre: string;
foto: string;
correo: string;
marcadores: any[]=[];
AuxStarCantidad = 0;
AuxComments = 0;
Horarioatencion = "";
Diasatencion="";
emergencia="";
clicDoctor: any = {
  viewbutton: false,
  name:'',
  cedula:''
};



/* mapa */
// mapa objeto
map: GoogleMap;
nearbyPlaces: any;
// datos de mi localización
mylocation: any = {
  latitude: 0,
  longitude: 0,
  speed: 0,
  altitude:0
};
// mi localizacion en variable latlng
mylatLng: any;
userLocationFromLatLng: any;
latLngResult: any;
userCity: any;
userPais: any;
  constructor(
        public authSrv: AutenticationService,
        private menuCtrl: MenuController,
        public Navega: NavController,
        public loading: LoadingService,
        public fileSrv: UploadfileService,
        private activatedRoute: ActivatedRoute,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        private platform:Platform,
        private toast: ToastController,
        private loadingCtrl: LoadingController,
        private alerta: AlertasService,
        private _ngZone: NgZone,
        private savefire: SaveinfirebaseService,
        public modalController: ModalController,
        private elementRef: ElementRef
  ) { }

  async ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'dashboard'});

    this.menuCtrl.enable(true);
    // cargar mapa
    await this.platform.ready();
    await this.loadMap('CargarMapa1');

    if(JSON.parse(localStorage.getItem('MedicViewMap'))){
      this.marcadores = [];
      if(JSON.parse(localStorage.getItem('MedicViewMap')).nombre){
        this.marcadores.push(JSON.parse(localStorage.getItem('MedicViewMap')));
      }else{
        this.marcadores= JSON.parse(localStorage.getItem('MedicViewMap'));
      } 
        //this.marcadores.push(JSON.parse(localStorage.getItem('MedicViewMap')));
      if (this.platform.ready()){
        this.map.clear()
      }
      console.log(this.marcadores);

      await this.addMarcador();
    }

    
  }

  async ionViewWillEnter() {
  
    if(JSON.parse(localStorage.getItem('MedicViewMap'))){
      this.marcadores = [];
      if(JSON.parse(localStorage.getItem('MedicViewMap')).nombre){
        this.marcadores.push(JSON.parse(localStorage.getItem('MedicViewMap')));
      }else{
        this.marcadores= JSON.parse(localStorage.getItem('MedicViewMap'));
      } 
        //this.marcadores.push(JSON.parse(localStorage.getItem('MedicViewMap')));
        if (this.platform.ready()){
        // this.map.clear() 
        }
      console.log(this.marcadores);

      await this.addMarcador();
    }

    this.menuCtrl.enable(true);
    if (!this.datosVerificados) {
      this.validaringreso();
    }
    this.cargardatosLocalstore() // para volver a cargar cuado se cambia en perfil
    this.getMyLocation();
  }

  validaringreso() {
      this.loading.present('Verificando datos...');
      setTimeout(() => {
        if (JSON.parse(localStorage.getItem('user')) === null ||
            JSON.parse(localStorage.getItem('user')) === undefined ||
            JSON.parse(localStorage.getItem('user')) === '') {
              this.loading.dismiss();
              this.menuCtrl.enable(false);
              this.Navega.navigateForward(['/login']);
        } else {
          this.loading.dismiss();
          this.menuCtrl.enable(true);
          this.cargardatosLocalstore();
        }
      }, 3000);
  }

  cargardatosLocalstore() {
      this.menuCtrl.enable(true);
      // console.log('username: ', this.Username);
      this.Username.displayName = JSON.parse(localStorage.getItem('user')).displayName;
      this.Username.uid = JSON.parse(localStorage.getItem('user')).uid;
      this.Username.photoURL = JSON.parse(localStorage.getItem('user')).photoURL;
      this.Username.email = JSON.parse(localStorage.getItem('user')).email;
      this.Username.emailVerified = JSON.parse(localStorage.getItem('user')).emailVerified;
      if (this.Username.photoURL === null) {
        console.log('entro al if');
        setTimeout(() => {
          this.fileSrv.getFile('default.png', 'imagenes/perfil', 'profile').then(
            res => {
              this.Username.photoURL = this.fileSrv.getUrl();
            }, err =>  {console.log(err); }
          );
        }, 1000);
      }

      // console.log('localstore', JSON.parse(localStorage.getItem('user')));
      this.datosVerificados = true;
  }
  canActivate() {
    this.menuCtrl.enable(true);

  }

  cerrarSesion() {
    this.menuCtrl.enable(false);
    this.datosVerificados = false;
    this.authSrv.SignOut();
  }

pagbuscar(){
  this.getDirComplet();
  this.Navega.navigateForward('/searchfilter');
}

callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    this.nearbyPlaces = [];
    for (var i = 0; i < results.length; i++) {
      //let place = results[i];
      this.nearbyPlaces.push(results[i]);
    }
  }
}

  /**
   * cargar mapa con configuraciones básicas
   */
  async loadMap(mssg: string){
    let service;


    
    //this.alerta.showToast(mssg,3000,'middle'); // mensaje al cargar el mapa
     await this.getMyLocation();
    // obtenemos localización actual
    await this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp) => {
      this.mylocation.latitude = resp.coords.latitude;
      this.mylocation.longitude = resp.coords.longitude;
      this.mylatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      this.getDirComplet();
    }).catch((error: any) => {
      this.alerta.showToast('No se puede obtener ubicación',5000,'middle'); 
    });

    // obteniendo lugares cerca de mi localizacion
    
   
    




    


    //carga configuración al mapa actual 'map'
    this.map = GoogleMaps.create("map_canvas", {
      
      timeout: 10000,
      //carga ubicacion del mapa
      camera: {
        target: {
          lat: this.mylocation.latitude,
          lng: this.mylocation.longitude,
        },
        zoom: 15,
        tilt: 30,
      },
      enableHighAccuary: true,
      // mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapType: 'overlayed', //roadmap
      controls: {
        compass: true,
        myLocation: true,
        //myLocationButton: true,
        indoorPicker: true,
        zoom: true
       },
       gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      }
    }); // termina configuracion del mapa

    


    // mover cámara a posición actual
    // localStorage.removeItem('MedicViewMap');
    this.iraMyPosition();
  }


  /**
   * Mover mapa a posición actual
   */
  iraMyPosition() {
    this.map.animateCamera({
      target: this.mylatLng,
      zoom: 15,
      duration: 3000
    });
  }
  /**
  * Obtener mi posición y almacenar en variables globales
  */
  async getMyLocation() {
    let watch = await this.geolocation.watchPosition();
    watch.subscribe((data) => {
      
      // console.log(data.coords.latitude + ' ' + data.coords.longitude);
      this.mylocation.latitude = data.coords.latitude;
      this.mylocation.longitude = data.coords.longitude;
      this.mylocation.speed = data.coords.speed;
      this.mylocation.altitude = data.coords.altitude;
      
    });
  }

  /**
   * obtiene todas las coordenadas completas
   */
  async getDirComplet() {
    
    let Geoptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults:5
    };
    if (this.platform.is('cordova')){
      this.nativeGeocoder.reverseGeocode(this.mylocation.latitude, this.mylocation.longitude, Geoptions).then(
        (result: NativeGeocoderResult[]) => {this.userLocationFromLatLng = result[0];
          this.userPais = this.userLocationFromLatLng.countryName;
          this.userCity = this.userLocationFromLatLng.locality;
          localStorage.setItem('myubicacion',JSON.stringify(result[0]));
          // {
          //   "latitude":0.9681789,
          //   "longitude":-79.6517202,
          //   "countryCode":"EC",
          //   "countryName":"Ecuador",
          //   "postalCode":"",
          //   "administrativeArea":"Esmeraldas",
          //   "subAdministrativeArea":"Esmeraldas",
          //   "locality":"Esmeraldas",
          //   "subLocality":"",
          //   "thoroughfare":"Avenida Simon Bolivar",
          //   "subThoroughfare":"143",
          //   "areasOfInterest":["143"]
          //   }
        }
      ).catch((error: any) => this.alerta.showToast(error,5000,'top'));
    } else {
      this.Getgeolocation(this.mylocation.latitude, this.mylocation.longitude, 'reverseGeocode');
    }
  }

  async Getgeolocation(lat: number, lng: number, type?: string) {
    if (navigator.geolocation){
      let geocoder = await new google.maps.Geocoder();
      let latlng = await new google.maps.Latlng(lat,lng);
      let request = { latLng: latlng};
      await geocoder.geocode( request, (results: any[], status: any) => {
        if (status == google.maps.GeocoderStatus.OK){
          let result = results[0];
          this._ngZone.run(() => {
            if (result != null) {
              this.userCity = result.formatted_address;
              this.alerta.showToast(this.userCity,6000,'middle');
              if (type === 'reverseGeocode') {
                this.latLngResult = result.formatted_address;
              }
            }
          })
        }
      });
    }
  }


    async getMyNameCity() {

    }
  /**
   * Agregar marcador
   */
  async addMarcador() {
    //this.map.clear();
    //this.map.clear();
    let htmlInfoWindow = new HtmlInfoWindow();
    
    // flip-flop contents
    // https://davidwalsh.name/css-flip
    let frame: HTMLElement = document.createElement('div');
    //this.map.clear();
    //this.marcadores = JSON.parse(localStorage.getItem('MedicViewMap'));
    
  for (let i = 0; i < this.marcadores.length; i++) {
    
    this.AuxComments = 0;
    this.AuxStarCantidad = 0;
    this.Horarioatencion = "";
    this.Diasatencion ="";
    let tel: string="";
    this.emergencia = "";


    //obteniendo telefonos
      this.marcadores[i].telefonos.forEach((item: { name: string; }, index: number) => {
        if (index <= 1){
          if(index > 0 ){
            tel = tel + ' - <a href="tel:'+ item.name +'" class="telf">'+ item.name  +'</a>';
          }else{
            tel = tel + '<a href="tel:'+ item.name +'" class="telf">'+ item.name  +'</a>';
          }
        }
        });  

    //obteniendo total de calificaciones
    await this.savefire.getStar(this.marcadores[i].cedula).then(res =>{
      this.AuxStarCantidad = res.length;
    },err => console.log(err));

    //obteniendo comentarios
    await this.savefire.getComment(this.marcadores[i].cedula).then(res => {
      if(res.length>0){
        this.AuxComments = res.length;
      }
    });

    //obteniendo horario
    this.Horarioatencion =  '<h4>de '+ this.marcadores[i].horarioatencion.h1 +' a ' + this.marcadores[i].horarioatencion.h2;
    if(this.marcadores[i].horarioatencion.h3 != ""){
      this.Horarioatencion =  this.Horarioatencion + ' y '+ this.marcadores[i].horarioatencion.h3 +' a ' + this.marcadores[i].horarioatencion.h4+ '</h4>';
    }
    this.Horarioatencion = this.Horarioatencion + '</h4>';

    //obteniendo dias se almacena en diasatencion
    this.getDias(this.marcadores[i].diaatencion);

    //verificando si atiende emergencia
    if (this.marcadores[i].emergencia.isChecked==true){
      this.emergencia = "$" + this.marcadores[i].emergencia.valor;
    }else{
      this.emergencia = "NO";
    }
      // console.log(this.marcadores[i]);
    frame.innerHTML = `
        
          <div class="flip-container" id="flip-container">
            <div class="flipper">
              <div class="front" style="overflow-y: scroll;" >
                <ion-text color="primary">
                  <h3>`+ this.marcadores[i].especialidadp +`<h3>
                </ion-text>
                <ion-text color="danger">
                  <h2>`+ this.marcadores[i].sigla  + ` ` + this.marcadores[i].nombre +`</h2>
                </ion-text>
                <h2>`+ this.marcadores[i].ubicacion.locality+ `-` + this.marcadores[i].ubicacion.administrativeArea+`</h2>
                <img src="`+ this.marcadores[i].foto +`" >
                `+ this.getStar(this.marcadores[i].star) +`
                <center class="likes">
                   <span class="ncalificacion"><ion-icon slot='start' name='thumbs-up-sharp'></ion-icon> <strong><b>`+ this.AuxStarCantidad +`</b></strong> </span>
                   <span class="ncalificacion"><ion-icon slot='start' name='chatbubbles'></ion-icon> <strong><b>`+ this.AuxComments +`</b></strong></spa>
                    <br>
                   <span>`+ tel +`</span>
                </center>  
                    
        <!--  <ion-button (click)="calificacion()" expand="block" fill="clear" shape="round">
          Califícame
        </ion-button> -->
              </div>


              <div class="back" style="overflow-y: scroll;">
                <!-------------------------- back content ----------------------------->
                <ion-text color="primary">
                  <h3>Doctor en:</h3>
                </ion-text>
                <ion-row>
                <ion-col size="12">
                  <h4 style="margin-right: 5px;">`+ this.marcadores[i].especialidadp +`, `+ this.marcadores[i].otrasespecialidades.toString() +`
                  </h4>
                </ion-col>
                </ion-row>
                <ion-text color="primary">
                    <h3>Horario de atención:</h3>
                </ion-text>
                <ion-row margin-right: 5px;>
                </ion-row>              
                <ion-row style="margin-right: 5px; margin-right: 5px;">
                  <ion-col size="12">`+ this.Horarioatencion +` </ion-col>
                  <ion-col><h4>`+ this.Diasatencion +`</h4></ion-col>
                </ion-row>
                <ion-text color="primary">
                <h3>Valor de consulta: </h3>
                </ion-text>
                  <ion-row class="ion-text-center">
                    <ion-col size="5" class="ion-text-center"><h4><b>Normal </b></h4></ion-col>
                    <ion-col size="7" class="ion-text-center"><h4><b>Emergencia</b></h4></ion-col>
                    <ion-col size="5" class="ion-text-center"><h4>$`+ this.marcadores[i].vconsulta +`</h4></ion-col>
                    <ion-col size="7" class="ion-text-center"><h4>`+ this.emergencia +`</h4></ion-col>
                    </ion-row>
                  <ion-row >
                  </ion-row>

                  <!-- <div id="boton" name="boton">
                  <button id="myBtn" type="button"  click="calificacion()" (click)="calificacion()" expand="block" fill="clear" shape="round">
                  Leer más...
                </button> -->


              </div> 
            </div>  
        `;

        frame.addEventListener("click", (evt) => {
          let container = document.getElementById('flip-container');
          if (container.className.indexOf(' hover') > -1) {
            container.className = container.className.replace(" hover", "");
          } else {
            container.className += " hover";
          }

       
        });
        htmlInfoWindow.setContent(frame, {
          width: "132px"
        });

        
        this.map.clear();
        this.map.addMarker({
          //title: this.mylocation.lat + '  ' + this.mylocation.lng,
          //snippet: 'nombre del doctor',
          //icon: 'blue',
          animation: 'BOUNCE',
          position: {
            lat: this.marcadores[i].ubicacion.latitude,
            lng: this.marcadores[i].ubicacion.longitude
          },
          icon: {url: 'https://img.icons8.com/plasticine/50/000000/user-location.png',
                size:{
                  width: 50,
                  height: 50
                }}
        }).then((marker: Marker) => {  

            marker.showInfoWindow();
           
          
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
              this.clicDoctor.viewbutton = true;
              this.clicDoctor.name= this.marcadores[i].sigla+" "+ this.marcadores[i].nombre;
              this.clicDoctor.cedula= this.marcadores[i].cedula;
              htmlInfoWindow.open(marker);
              console.log('activo');
            // this.alerta.showToast('mostrar informacion del marcador',3000,'middle');
          });

          marker.on(GoogleMapsEvent.INFO_CLOSE).subscribe(()=>{
            this.clicDoctor.viewbutton = false;
            this.clicDoctor.name= '';
            this.clicDoctor.cedula= '';
            console.log('close infowindo');
          });
          
          

            // marker.trigger(GoogleMapsEvent.MARKER_CLICK,[{
              
            // }])
           //this.map.setCameraZoom(12);
           this.map.animateCamera({
                  target: {lat:this.marcadores[0].ubicacion.latitude,lng:this.marcadores[0].ubicacion.longitude},
                  zoom:12,
                  tilt: 20
           });
        });
    }//fin for
    
  } //fin de marcador funcion

  async getDias(dias: any){
    this.Diasatencion ="";
    if(// si atiende de lunes a viernes
      dias[0].isChecked == true &&
      dias[1].isChecked == true &&
      dias[2].isChecked == true &&
      dias[3].isChecked == true &&
      dias[4].isChecked == true &&
      dias[5].isChecked == false &&
      dias[6].isChecked == false
    ){ 
      this.Diasatencion="Lunes a Viernes"
    }else if ( // lunes a sábado
      dias[0].isChecked == true &&
      dias[1].isChecked == true &&
      dias[2].isChecked == true &&
      dias[3].isChecked == true &&
      dias[4].isChecked == true &&
      dias[5].isChecked == true &&
      dias[6].isChecked == false
    ){
      this.Diasatencion="Lunes a Sábado"
    }else if ( // lunes a domingo
      dias[0].isChecked == true &&
      dias[1].isChecked == true &&
      dias[2].isChecked == true &&
      dias[3].isChecked == true &&
      dias[4].isChecked == true &&
      dias[5].isChecked == true &&
      dias[6].isChecked == true
    ){
      this.Diasatencion="Lunes a Domingo"
    } else{
      dias.forEach((semana,index) => {
        if(semana.isChecked ==true){
          if (index == 0){
            this.Diasatencion = semana.val;
          }else{
            this.Diasatencion = this.Diasatencion + ", " + semana.val;
          }
        }
      });
    }
  }

  getStar(total: any){
    let div = '<h5> <div>';
    if(total <= 0){
      div = div + `
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 0 && total <= 0.7){
      div = div + `
      <ion-icon  slot='start' name='star-half-outline' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 0.7 && total <= 1.2){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 1.2 && total <= 1.7){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star-half-outline' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 1.7 && total <= 2.2){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 2.2 && total <= 2.7){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star-half-outline' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 2.7 && total <= 3.2){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 3.2 && total <= 3.7){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star-half-outline' color='amarillo'></ion-icon>  
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 3.7 && total <= 4.2){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon slot='start' name='star-outline' color='dark'></ion-icon> 
      `;
    }
    if(total > 4.2 && total <= 4.7){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star-half-outline' color='amarillo'></ion-icon>    
      `;
    }
    if(total >= 5){
      div = div + `
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon> 
      <ion-icon  slot='start' name='star' color='amarillo'></ion-icon>  
      `;
    }

    div = div + '</div></h5>';
    return div;
  }

  clearMap(){
    localStorage.removeItem('MedicViewMap');
    this.map.clear();
    this.map.animateCamera({
      target: {lat:JSON.parse(localStorage.getItem('myubicacion')).latitude,lng:JSON.parse(localStorage.getItem('myubicacion')).longitude},
      zoom:15,
      tilt: 20
    });
  }

  moveMiPosition(){
    this.map.animateCamera({
      target: {lat:JSON.parse(localStorage.getItem('myubicacion')).latitude,lng:JSON.parse(localStorage.getItem('myubicacion')).longitude},
      zoom:15,
      tilt: 20
    });
  }

  /**
   * Presenta formulario para calificación
   */
   public async  calificacion(ev: any) {

    const modal = await this.modalController.create({
      component: CalificacionPage,
      cssClass: 'my-custom-modal-class',
      mode:'ios',
      backdropDismiss: true,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        'name': this.clicDoctor.name,
        'cedula': this.clicDoctor.cedula,
      }
    });
    return await modal.present();
  }

  /**
   * Presenta formulario para calificación
   */
  public async  Comentarios(ev: any) {

    const modal = await this.modalController.create({
      component: ComentariosPage,
      cssClass: 'my-custom-mogdal-class',
      mode:'ios',
      backdropDismiss: true,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        'name': this.clicDoctor.name,
        'cedula': this.clicDoctor.cedula,
      }
    });
    return await modal.present();
  }

  async infoMedic(){
    const modal = await this.modalController.create({
      component: InfoPage,
      cssClass: 'g',
      mode:'ios',
      backdropDismiss: true,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        'name': this.clicDoctor.name,
        'cedula': this.clicDoctor.cedula,
      }
    });
    return await modal.present();
  }
  dimiss(){
    this.modalController.dismiss();
  }

}
