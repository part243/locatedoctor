import { Component, OnInit, Input, ViewChild, ContentChild, NgZone, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from "@ionic-native/google-maps";

import { ActivatedRoute } from '@angular/router';
import {  MarkerOptions,  GoogleMapOptions, LatLng } from '@ionic-native/google-maps/ngx';
import {Environment} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';
declare var google;
import { Platform, LoadingController, ToastController } from "@ionic/angular";
import { LoadingService } from 'src/app/servicios/loading.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { JsonPipe } from '@angular/common';
import { empty } from 'rxjs';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-miubicacion',
  templateUrl: './miubicacion.page.html',
  styleUrls: ['./miubicacion.page.scss'],
})
export class MiubicacionPage implements OnInit {
  @ViewChild('div2', {static: true}) div2: ElementRef;

 marker: any;

 location: any = {
  // uid: JSON.parse(localStorage.getItem('user')).uid,
   latitude:  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.latitude,
   longitude:  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.longitude,
   address:  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.address,
   referencia:  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.referencia,
   country: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.country,
   locality: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.locality,
   administrativeArea: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.administrativeArea,
   subAdministrativeArea: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.subAdministrativeArea,
   subLocality: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.subLocality,
 }

  AUXlocation: any = {
  // uid: JSON.parse(localStorage.getItem('user')).uid,
   latitude:  JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.latitude,
   longitude:  JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.longitude,
   address:  JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.address,
   referencia:  JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.referencia,
   country: JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.country,
   locality: JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.locality,
   administrativeArea: JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.administrativeArea,
   subAdministrativeArea: JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.subAdministrativeArea,
   subLocality: JSON.parse(localStorage.getItem('AUXdatosmedicos')).ubicacion.subLocality,
 }
 

//  tmp: any = {
//   latitude: '',
//   longitude: '',
//  };

 tmp = JSON.parse(localStorage.getItem('datosmedicos'));
 map: GoogleMap;
 mapReady: boolean = false;

 logicLocation = true;

 locaLtnLgn: LatLng;

  constructor(
          public modalCtrl: ModalController,
          private platform: Platform,
          private loading: LoadingService,
          private alertas: AlertasService,
          public detecchange: ChangeDetectorRef,
          public geocoder: NativeGeocoder,
          public nav: NavController
          ) { }

  async ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'get_my_ubication'});

    await this.platform.ready();
    await this.loadMap();
    
    // console.log(JSON.parse(localStorage.getItem('datosmedicos')).longitude);
  }



  async ionViewDidEnter() {
    
    //crear latnlgn para ubicar el marcador
    if(this.location.latitude != "" &&
       this.location.longitude != ""){
          this.locaLtnLgn = new LatLng(this.location.latitude,this.location.longitude);
          console.log("SI HAY DATOS DE LOCALIZACION:::" + JSON.stringify(this.locaLtnLgn));
    }else{
      this.getMyUbication();
    }

    // this.irAubicacion('');
  }
  /**
   * obtiene mi ubicacion actual
   */
  getMyUbication(){
    this.map.getMyLocation().then((location: MyLocation) => {
    this.location.latitude = location.latLng.lat;
    this.location.longitude = location.latLng.lng;
    this.locaLtnLgn = location.latLng;
    console.log("NUEVOS DATOS DE LOCALIZACION:::" + JSON.stringify(this.locaLtnLgn));
    });    
    this.detecchange.detectChanges();
}

  //CARGAR MAPA
  async loadMap() {
    this.alertas.showToast("cargo mapa location",500,"top");
    this.map = GoogleMaps.create("map_canvas1", {
        timeout: 10000,
        //carga ubicacion del mapa por defecto
        camera: {
          target: {
            lat: 0.968231,
            lng: -79.651116
          },
          zoom: 12,
          tilt: 30,
        },
        enableHighAccuary: true,
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapType: 'hybrid',
        controls: {
          //compass: true,
          //myLocation: true,
          // myLocationButton: true,
          //indoorPicker: true,
          zoom: true
         },
         gestures: {
          scroll: true,
          tilt: true,
          //rotate: true,
         // zoom: true
        }
    
    });
    
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
    this.mapReady = true;
    });
    
    this.ViewLocationMedic();

  }


  /**
   * mover mapa a ubicacion almacenada o actual y colocar marcador
   */
  async irAubicacion(n: any){ 
        this.map.clear();
        this.map.getMyLocation().then((location: MyLocation) => {
        if( n == '1'){
          this.getMyUbication();
        }
        this.map.animateCamera({
          target: location.latLng,
          zoom:15,
          tilt:30,
          bearing: 45,
          duration: 1000,
        });
        
        //verificamos si 
        //localStorage.setItem('datosmedicos', JSON.stringify({latitude: location.latLng.lat, longitude: location.latLng.lng}));
        
        //this.cargalocation();
        this.detecchange.detectChanges();
        this.map.addMarker({
          title: "Mi ubicación",
          snippet: 'Puede arrastrar el marcador',
          position: location.latLng,
          draggable: true,
          icon: {
              url: 'https://img.icons8.com/nolan/50/user-location.png', 
              size:{
                width: 50,
                height: 50
              }},
          disableAutoPan: true,
          animation: GoogleMapsAnimation.BOUNCE
        }).then((marker: Marker) => {
          this.marker = marker;
          this.generateAddress(this.location.latitude, this.location.longitude);
          // this.generateAddress(JSON.parse(localStorage.getItem('datosmedicos')).latitude, JSON.parse(localStorage.getItem('datosmedicos')).longitude);
          marker.trigger(GoogleMapsEvent.MARKER_CLICK);
          marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(()=>{
            //console.log('HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA:::' + JSON.parse(localStorage.getItem('datosmedicos')).latitude);
            // console.log(JSON.stringify(localStorage.getItem('datosmedicos')));
            //this.map.clear();
            let pos = marker.getPosition();
            this.location.latitude = pos.lat;
            this.location.longitude = pos.lng;
            
            //this.cargalocation()
            this.generateAddress(pos.lat, pos.lng);
            this.detecchange.detectChanges();
        
          });
        });
        }).catch((error) =>{
        this.loading.dismiss(); //cerrar loading
        this.alertas.showToast(error.error_message,500,'top');
        });      
  }



  async ViewLocationMedic(){
    this.map.clear();
    this.map.animateCamera({
      target: {lat: this.AUXlocation.latitude, lng: this.AUXlocation.longitude},
      zoom:15,
      tilt:30,
      bearing: 45,
      duration: 1000,
    });
    this.map.addMarker({
      title: "Mi ubicación",
      snippet: 'Puede arrastrar el marcador',
      position: {lat: this.AUXlocation.latitude, lng:this.AUXlocation.longitude},
      draggable: true,
      icon: {
          url: 'https://img.icons8.com/nolan/50/user-location.png', 
          size:{
            width: 50,
            height: 50
          }},
      disableAutoPan: true,
      animation: GoogleMapsAnimation.BOUNCE
    }).then((marker: Marker) => {
      this.marker = marker;
      this.generateAddress(this.location.latitude, this.location.longitude);
      // this.generateAddress(JSON.parse(localStorage.getItem('datosmedicos')).latitude, JSON.parse(localStorage.getItem('datosmedicos')).longitude);
      marker.trigger(GoogleMapsEvent.MARKER_CLICK);
      marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe(()=>{
        let pos = marker.getPosition();
        this.location.latitude = pos.lat;
        this.location.longitude = pos.lng;
        
        //this.cargalocation()
        this.generateAddress(pos.lat, pos.lng);
        this.detecchange.detectChanges();
    
      });
    });     
  }


  /**
  * Genera la direccion larga con nombres en base a lat y lng
  * @param lat latitud
  * @param lng longitud
  */
  async generateAddress(lat: any, lng: any) {
    let options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 2
    };
    await this.geocoder.reverseGeocode(lat,lng, options).then((result: NativeGeocoderResult[]) => {
        let dir= '';
        let s: any = [];
        let direciones: any = [];

        this.location.country = result[0].countryName;
        this.location.locality = result[0].locality;
        this.location.subLocality = result[0].subLocality;
        this.location.administrativeArea = result[0].administrativeArea;
        this.location.subAdministrativeArea = result[0].subAdministrativeArea;

        // console.log(JSON.stringify(result[0]));
        // si la ciudad y cantón son los mismos
        if (JSON.stringify(result[0].thoroughfare != '')){
          s.push(true);
          direciones.push(result[0].thoroughfare);
        }
        if (JSON.stringify(result[0].subThoroughfare) != "" && JSON.stringify(result[0].subThoroughfare != undefined)){
          s.push(true);
          let a = result[0].subThoroughfare.toString().replace(/['"]+/g,'');
          direciones.push(a);
        }
    
        if (JSON.stringify(result[0].locality != '')){
          s.push(true);
          direciones.push(result[0].locality);
        }
    
        if (JSON.stringify(result[0].subAdministrativeArea) != ''){
          s.push(true);
          direciones.push(result[0].subAdministrativeArea);
      }
    
        if (JSON.stringify(result[0].administrativeArea) != ''){
            s.push(true);
            direciones.push(result[0].administrativeArea);
        }
        
    
    
        for (let x = 0; x < s.length; x++) {
    
          if(s[x] == true){
            dir = dir + " " + direciones[x];
          }
          
        }
        this.location.address = dir;
        this.detecchange.detectChanges();
    }).catch((error:any) =>this.alertas.showToast('No se puede obtener dirección',500,'top'));
    
    }
  /**
   * Cierra pagina actual sin almacenar datos
   */
    cerrar() {
      this.nav.navigateForward('/registro');
    }
  /**
   * Almacenar datos de ubicacion en localstorage
   */
    aceptar() {
      if (this.location != this.AUXlocation) {
         //carga de loclstorage
        this.tmp.ubicacion.latitude = this.location.latitude;
        this.tmp.ubicacion.longitude = this.location.longitude;
        this.tmp.ubicacion.address = this.location.address;
        this.tmp.ubicacion.referencia = this.location.referencia;

        this.tmp.ubicacion.country = this.location.countryName;
        this.tmp.ubicacion.locality = this.location.locality;
        this.tmp.ubicacion.subLocality = this.location.subLocality;
        this.tmp.ubicacion.administrativeArea = this.location.administrativeArea;
        this.tmp.ubicacion.subAdministrativeArea = this.location.subAdministrativeArea;

        localStorage.setItem('datosmedicos', JSON.stringify(this.tmp));
        this.AUXlocation = this.location;
      }
      this.nav.navigateForward('/registro');
      
      }
}
  