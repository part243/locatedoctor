import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonSearchbar, IonInfiniteScroll, NavController} from '@ionic/angular';
import { GetUbicacionService } from '../../servicios/get-ubicacion.service'
import { SaveinfirebaseService } from '../../servicios/saveinfirebase.service';
import { AlertasService } from '../../servicios/alertas.service';
import { LoadingService } from '../../servicios/loading.service';
import { UploadfileService } from '../../servicios/uploadfile.service';
import * as firebase from 'firebase/app';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { FuncionesService } from '../../servicios/funciones.service';
import {NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-searchfilter',
  templateUrl: './searchfilter.page.html',
  styleUrls: ['./searchfilter.page.scss'],
})
export class SearchfilterPage implements OnInit {
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  ciudadUsuario: string= "";
  regionUsuario: string= "";
  Comentario: any[] = [];
  SumStar=0;
  probadno: any[] = Array(100);
  lstBusqueda: Array<any> = [];
  tamanioLstBusqueda:number;
  especialidades: any=[];
  buscarpor="Especialidades";
  resultEspecialidades: any=[];


  mylocation: any = {
    latitude: 0,
    longitude: 0,
    speed: 0,
    altitude:0
  };

  hayHistorial: boolean = false;
  Historial: any[] = [];

  constructor(
               private firebase: SaveinfirebaseService,
               private alertas: AlertasService,
               private loading: LoadingService,
               private upload: UploadfileService,
               private nav: NavController,
               private func: FuncionesService,
               private nativeGeocoder: NativeGeocoder,
               private geolocation: Geolocation
               ) { 
                
                          }

  ngOnInit() {
    //borramos lista de medicos almacenados
    localStorage.removeItem('MedicViewMap');
    //obtiene ubicación
    //this.getMyLocation();
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'search_medic'});


    setTimeout(() => {
      this.searchbar.setFocus();
      this.getMyLocation();
    },500);

  }

  ionViewWillEnter(){
    this.hayHistorial = false;
    this.resultEspecialidades= [];
    setTimeout(() => {
      this.searchbar.setFocus();
    },500);
    if(!(localStorage.getItem('historial') == null)){
      this.hayHistorial = true;
      this.Historial = JSON.parse(localStorage.getItem('historial'));
    }
  }
  ionViewDidEnter() {
    // this.hayHistorial = false;
    // this.resultEspecialidades= [];
    // setTimeout(() => {
    //   this.searchbar.setFocus();
    // },500);
    // if(!(localStorage.getItem('historial') == null)){
    //   this.hayHistorial = true;
    //   this.Historial = JSON.parse(localStorage.getItem('historial'));
    // }
  }



  busqueda(val:any){
    this.buscarpor=val;
    this.lstBusqueda= [];
    this.resultEspecialidades = [];
    this.tamanioLstBusqueda = 0;
    this.Comentario = [];
  }


/** buscar por especialidad */
buscarPorEspecialidad(ev:any){
  localStorage.removeItem('MedicViewMap');
  //google analitico
  firebase.analytics().logEvent('search',{'search_term':ev.target.value});

  //BUSQUEDA POR ESPECIALIDADES
  if (ev.target.value != ''){
    if(this.buscarpor == 'Especialidades'){
          this.lstBusqueda = [];
          this.tamanioLstBusqueda = 0;
          // caso contrario buscar en las especialidades y sub especialidades
          if (JSON.parse(localStorage.getItem('especialidades'))){
            this.especialidades = JSON.parse(localStorage.getItem('especialidades'));
          }else{
          //obteniendo especialidades
          
          this.loading.present('Espere...');
            this.firebase.getDocuments('especialidades').then(res => {
              res.docs.forEach(doc => {
                if(doc.data().name != undefined){
                  this.especialidades.push({id:doc.data().id,name:doc.data().name});
                }
              });   
              
            localStorage.setItem('especialidades', JSON.stringify(this.especialidades));
            this.resultEspecialidades = this.especialidades.filter(item => {return item.name.includes(ev.target.value)});
            this.loading.dismiss();
            }, err => {
              //console.log(err); 
              this.loading.dismiss();});
          }
          //lista de especialidad
          this.resultEspecialidades = this.especialidades.filter(item => {return item.name.toLowerCase().includes(ev.target.value.toLowerCase())});
      
    }
  }
  
}

  /**Buscar medico por NOMBRE */
  async searchMedic(ev: any){
    localStorage.removeItem('MedicViewMap');
      //google analitico
     firebase.analytics().logEvent('search',{'search_term':ev.target.value});

    let AuxMedicslst: any[] = []; //todos medicos find de firebase
    let arrayFindMedic: any[]=[]; //lista de medicos sin acentos y minuscula
    let NewarrayFindMedic: any[] = Array();
    if (ev.target.value != ''){
      //BUSQUEDA POR NOMBRES
      if(this.buscarpor == 'Nombres'){
        this.lstBusqueda = [];
        if (ev.target.value.length >3){
          this.loading.present('Buscando médico...');
          this.firebase.getMedicFromMyCity(ev.target.value).then(res =>{
            
            var acentos = "ãàáäâèéëêìíïîòóöôùúüûÑñÇç";
            var original = "aaaaaeeeeiiiioooouuuunncc";
            // push in array list medic from name
            //filtrar dentro de los rsultados obtenidos desde firebase
            if (res.length > 0){ //si encontró algun doctor con el nombre ingresado
              this.resultEspecialidades = [];
              for (let x = 0; x < res.length; x++) { //recorreomos elementos 
              this.lstBusqueda.push(res[x].data());
              console.log(this.lstBusqueda); //------------------------------------------
              //reemplazamos los acentos por originales para filtrar
              let name = res[x].data().nombre.toLowerCase();
              for (var j = 0; j < acentos.length; j++) {
                 name = name.replace(acentos.charAt(j), original.charAt(j)).toLowerCase();
                };
              arrayFindMedic.push(name); //puedo almacenar tambien el index
              
              }
            if(arrayFindMedic.length > 0){ //si tenemos lista de nombres obtenidos
              let nameFind = ev.target.value.toLowerCase(); //obtenemos nombre buscado en minuscula
              for (var j = 0; j < acentos.length; j++) { //transformamnos las tildes a normales
                nameFind = nameFind.replace(acentos.charAt(j), original.charAt(j)).toLowerCase();
               };
                NewarrayFindMedic = arrayFindMedic.filter(item => {return item.includes(nameFind)});
                //console.log(NewarrayFindMedic);
                if(NewarrayFindMedic.length > 0){ //tenemos filtro exacto
                  for (let i = 0; i < NewarrayFindMedic.length; i++) {
                    for (let s = 0; s < arrayFindMedic.length; s++) {
                      if(NewarrayFindMedic[i] == arrayFindMedic[s]){
                          AuxMedicslst.push(this.lstBusqueda[s]);
                      }
                    }
                  }
                  this.lstBusqueda = AuxMedicslst;
                }else{
                  this.lstBusqueda = [];
                  this.alertas.showToast('No se encontraron médicos cercanos',1000,'top');
                }
              }else{
                this.lstBusqueda = [];
                this.alertas.showToast('No se encontraron médicos cercanos',1000,'top');
              }
              this.loading.dismiss();
            }else{
              this.lstBusqueda = [];
              this.alertas.showToast('No se encontraron médicos cercanos',1000,'top')
            }
            this.cambiarEspecialidades();
            //console.log(res.length);
          });
        }
      }

    }
  }

  /** Buscar medicos a partir de especialidad */
  async searchMedicfromEspecialidad(code:any){
    


    this.loading.present('Buscando médicos...');
    // OBTENER TODOS LOS MEDICOS CON LA ESPECIALIDAD SELECCIONADA
    this.firebase.getMedicFromEspecialidadMyCity(code).then(res => {
      this.lstBusqueda = [];
      if (res.length > 0){ //VERIFICAR SI EXISTEN MEDICOS
        this.hayHistorial = false;
        this.resultEspecialidades = [];
        for (let x = 0; x < res.length; x++) {
        this.lstBusqueda.push(res[x].data());
        }
      }else{
        this.hayHistorial = true;
      }

      // BUSCAR MEDICOS CON LA MISMA ESPECIALIDAD EN OTRAS.
      this.firebase.getMedicFromOtrasEspecialidadesMyCity(code).then(res => { 
        this.loading.dismiss();
        if (res.length > 0){ 
          this.resultEspecialidades =[];
          for (let x = 0; x < res.length; x++) {
          this.lstBusqueda.push(res[x].data());
          }
        }

        if(this.lstBusqueda.length <= 0){
          this.alertas.showToast('No se han encontrado médicos en esa especialidad',1000,'top');
        }else{
          this.cambiarEspecialidades();
         // console.log('lis espcialidades');
         // console.log(this.lstBusqueda);
        }
       
      });
    });
    //console.log(code);
  }



  /**cambia los codigos de las especialidades por los nombres */
  async cambiarEspecialidades(){
    this.Comentario=[];
    let subespe: any[]=[];
    let especialidadeslista = JSON.parse(localStorage.getItem('especialidades'));
    let distancia: any;

    loop1:
    for (let x = 0; x < this.lstBusqueda.length; x++) {
      //GENERANDO DISTANCIA
      let distancia = await google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(JSON.parse(localStorage.getItem('myubicacion')).latitude, JSON.parse(localStorage.getItem('myubicacion')).longitude), 
        new google.maps.LatLng(this.lstBusqueda[x].ubicacion.latitude, this.lstBusqueda[x].ubicacion.longitude))/1000 + 1;

      


      subespe = [];
      let CodeEspec = this.lstBusqueda[x].otrasespecialidades.toString().split(",");
      let listaEspeCode: any[]= [];


      listaEspeCode.push(this.lstBusqueda[x].especialidadp);
      if(CodeEspec){
        for (let i = 0; i < CodeEspec.length; i++) {
          listaEspeCode.push(CodeEspec[i]); //obtenemos los codigos de todas las especialidades
        }
      }
    
      //obtiene lista de comentarios enviados a cierta cedula
       this.firebase.getComment(this.lstBusqueda[x].cedula).then(res => {
          if(res.length>0){
            this.Comentario.push({'cedula':res[0].data().para,'comentarios':res.length});
          }
          
         });
      loop2:
      for (let j = 0; j < listaEspeCode.length; j++) { //recorre codigos
        loop3:
        for (let l = 0; l < especialidadeslista.length; l++) { //recorre lista
          if(listaEspeCode[j].toString() == especialidadeslista[l].id.toString() ){ //comparando
            if(j == 0){//estamos en la especialdiad principal
              this.lstBusqueda[x].especialidadp =  especialidadeslista[l].name;
              await this.getStar(this.lstBusqueda[x].cedula,x); //calcular total de estrellass

            }else{ //otras especialidades agegamos al array
                subespe.push(especialidadeslista[l].name)
              break loop3;
            }
          }
        }
      }
      //copiamos los nuevos nombres de otrasespecialidades
      for (let k = 0; k < subespe.length; k++) {
        this.lstBusqueda[x].otrasespecialidades = subespe;
      }  
      

      //AGREGANDO LA DISTANCIA
      //OBTENIENDO DISTANCIA
      let d =  parseFloat(distancia.toString()).toFixed(1) + ' km';
      //agregando distancia
      Object.assign(this.lstBusqueda[x],{'distancia':d});

          

      console.log(JSON.parse(localStorage.getItem('myubicacion')).latitude,
      JSON.parse(localStorage.getItem('myubicacion')).longitude,
      this.lstBusqueda[x].ubicacion.latitude,
      this.lstBusqueda[x].ubicacion.longitude);
      //obteniendo FOTOGRAFIA
      await this.firebase.getIdfromDocument(this.lstBusqueda[x].cedula).then(
        res => {
         // console.log(res[0].id);
          this.upload.getFile(res[0].id,'imagenes/perfil','profile').then(
            res => {
              this.lstBusqueda[x].foto = res;
            },err => { 
              this.lstBusqueda[x].foto = "https://firebasestorage.googleapis.com/v0/b/locatedoctor-badda.appspot.com/o/imagenes%2Fapp%2Fapp_logoSinText.png?alt=media&token=88fc4841-ac07-49ec-b4a2-fa0b293c879a";
             // console.log(err);
            }
          );
        },
        err => {//console.log(err);
          this.lstBusqueda[x].foto = "https://firebasestorage.googleapis.com/v0/b/locatedoctor-badda.appspot.com/o/imagenes%2Fapp%2Fapp_logoSinText.png?alt=media&token=88fc4841-ac07-49ec-b4a2-fa0b293c879a";
        }
      );

    }
     // console.log('matriz');
     // console.log(this.lstBusqueda);
          //google analitico
          firebase.analytics().logEvent('search',{'by':this.lstBusqueda[0].especialidadp});
    
    //this.loading.present('cargando...');
    setTimeout(() => {
      if(this.lstBusqueda.length > 1){
      
        this.burbuja();


       }
       //this.loading.dismiss();
    }, 1000);

       //this.lstBusqueda.sort((a, b) => a.star.toString().localeCompare(b.star.toString()));
      
}


 getDistanceFromLatLonInKm(lat1: number,lon1: number,lat2: number,lon2: number) {
  let R = 6371; // Radius of the earth in km
  let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  let dLon = this.deg2rad(lon2-lon1); 
  let a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

 deg2rad(deg) {
  return deg * (Math.PI/180)
}

  burbuja(){

  if(this.lstBusqueda.length > 1){
      //recorreremos todos los elementos hasta n-1
      for(let i=0;i<(this.lstBusqueda.length-1);i++)
      //recorreremos todos los elementos hasta n-i, tomar en cuenta los ultimos no tiene caso ya que ya estan acomodados.
      for(let j=0;j<(this.lstBusqueda.length-i);j++){
          //comparamos
          if(this.lstBusqueda[j].star<this.lstBusqueda[j+1].star){
              //guardamos el numero mayor en el auxiliar
              let aux=this.lstBusqueda[j];
              //guardamos el numero menor en el lugar correspondiente
              this.lstBusqueda[j]=this.lstBusqueda[j+1];
              //asignamos el auxiliar en el lugar correspondiente
              this.lstBusqueda[j+1]=aux;
  
          }
  
      }
  }

}

  /**obtiene todas las estrellas de un doctor y calcula la calificación*/
  async getStar(cedula: any,indice:any){
    let stars: number[]=[0,0,0,0,0,0];
    let tot: number = 0;
    let totac: number = 0;
    this.firebase.getStar(cedula).then(res =>{
      
      if (res.length > 0){
        for (let i = 0; i < res.length; i++) {
          if(res[i].data().calificacion == 1){ //acumulamos calificaciones 1
            stars[1]= stars[1] + res[i].data().calificacion;
          }
          if(res[i].data().calificacion == 2){ //acumulamos calificaciones 2
            stars[2]= stars[2] + res[i].data().calificacion;
          }
          if(res[i].data().calificacion == 3){ //acumulamos calificaciones 3
            stars[3]= stars[3] + res[i].data().calificacion;
          }
          if(res[i].data().calificacion == 4){ //acumulamos calificaciones 4
            stars[4]= stars[4] + res[i].data().calificacion;
          }
          if(res[i].data().calificacion == 5){ //acumulamos calificaciones 5
            stars[5]= stars[5] + res[i].data().calificacion;
          }
        }
        //calculamos totalidad de puntuación
        for (let x = 1; x < stars.length; x++) {
          tot= tot + stars[x] * x;
          totac = totac + stars[x]; 
        }
      }

      //retornamos divicion
      if(totac != 0){
        tot= tot/totac;
      }
      
      this.SumStar = tot;
      if(this.lstBusqueda){
        this.lstBusqueda[indice].star = tot;
      }
      
      //console.log(tot);
    });
  }


  /** ver lista de medicos en el mapa */
  VerEnMapa(id_medic: any, index: any){
    console.log(id_medic + ' ' + index);
    if(id_medic){// ALMACENAR SI SELECCIONO UN MÉDICO EN LOCAL.STORAGE
      //google analitico
      firebase.analytics().logEvent('select_medic',{'medic_id':id_medic});
      localStorage.setItem('MedicViewMap',  JSON.stringify(this.lstBusqueda[index]));
      this.SaveHistory();
      this.nav.navigateForward('/dashboard');
    }else{
      localStorage.setItem('MedicViewMap',  JSON.stringify(this.lstBusqueda[index]));
      this.SaveHistory()
      this.nav.navigateForward('/dashboard');
    }
    this.resultEspecialidades=[];
  }

  
  /** ver lista de medicos en el mapa */
  VerEnMapaHistorial(id_medic: any, index: any){
    
    console.log(id_medic + ' ' + index);
    if(id_medic){// ALMACENAR SI SELECCIONO UN MÉDICO EN LOCAL.STORAGE
      //google analitico
      firebase.analytics().logEvent('select_medic',{'medic_id':id_medic});
      localStorage.setItem('MedicViewMap',  JSON.stringify(this.Historial[index]));
      this.nav.navigateForward('/dashboard');
    }
    this.resultEspecialidades=[];
  }

  /**
   * Alamcena para visualizar en el historial
   */
  SaveHistory(){
    
    try {
      const dat: any[] = [];
      dat.push(JSON.parse(localStorage.getItem('MedicViewMap')));
      if(localStorage.getItem('historial') === null){
          // almacenar el nuevo historial
         localStorage.setItem('historial',JSON.stringify(dat));
      }else{
        const historial = JSON.parse(localStorage.getItem('historial'));
        console.log(historial);
        let existe=false;
        historial.forEach(itemH => {
          if(itemH.nombre == dat[0].nombre){//si el nombre existe
            console.log('si existe');
            existe = true;
          }
        });
        if(!existe){
            historial.push(dat[0]);
            localStorage.setItem('historial', JSON.stringify(historial));
        }
      }
      const historial = JSON.parse(localStorage.getItem('historial'));
    } catch (error) {
      console.log(error);
    }
    

    
  }

  async getMyLocation() {
    let Geoptions: NativeGeocoderOptions = {
      useLocale: true,
      maxResults:5
    };

    await this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp) => {
      this.mylocation.latitude = resp.coords.latitude;
      this.mylocation.longitude = resp.coords.longitude;
     // this.mylatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      //this.getDirComplet();
    }).catch((error: any) => {
      this.alertas.showToast('No se peude actualizar ubicación',5000,'top'); 
    });

    this.nativeGeocoder.reverseGeocode(this.mylocation.latitude, this.mylocation.longitude, Geoptions).then(
      (result: NativeGeocoderResult[]) => {
        //this.userLocationFromLatLng = result[0];
        //this.userPais = this.userLocationFromLatLng.countryName;
        //this.userCity = this.userLocationFromLatLng.locality;
        localStorage.setItem('myubicacion',JSON.stringify(result[0]));
      }
    ).catch((error: any) => console.log('No se peude actualizar ubicación',5000,'top'));
  
  }

}


    
  


