import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SaveinfirebaseService } from '../../../servicios/saveinfirebase.service';
import { FuncionesService } from '../../../servicios/funciones.service';
import { SortPipe } from '../../../pipes/sort.pipe';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import {MiubicacionPage} from '../../miubicacion/miubicacion.page';
import { Platform, LoadingController, ToastController } from "@ionic/angular";
import { LoadingService } from '../../../servicios/loading.service';
import {datosMedicos} from 'src/app/interfaces/interfaces'
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  variableDatosMedicosCosntruir: datosMedicos;

  Opacity: any = 1;
  errorMessage = '';
  successMessage = '';
  isDoctor: boolean = true;
  frmDoctor: FormGroup;
  frmEnfer: FormGroup;
  frmdatos = false; //cuando los demas datos estan ok
  tmp: any;
  emergencia= {valor:"", isChecked:JSON.parse(localStorage.getItem('datosmedicos')).emergencia.isChecked}
  
  validationMessages = {
    cedula : [
            {type: 'required', message: 'Ingrese su identificación.'},
    ],
    nombre: [
            {type: 'required', message: 'Nombre es requerido.'},
            {type: 'minlength', message: 'Mínimo 6 caracteres.'}
    ],
    paisorigen: [
      {type: 'required', message: 'País de origen requerido.'}
    ],
    especialidad: [
      {type: 'required', message: 'Especialidad es necesaria.'}
    ],
    otrasEspecialidades: [
      {type: 'required', message: 'Especialidad es necesaria.'}
    ],
    anio: [
      {type: 'required', message: 'Ingrese los años que tiene ejerciendo su profesión.'}
    ],
    vconsulta: [
      {type: 'required', message: 'ingrese valor de consulta.'}
    ],
    ubicacion: [
      {type: 'required', message: 'Ingrese su ubicación'}
    ],
  };

  
  public ListaPais: any = [];
  public sortedArr: any;
  public sortedEspecialidades: any;
  public otrosServicios: any = []; // todas las actividades a almacenar en firebase
  public otrosServiciosMostrar: any = [];

  public telefonos: any = []; // todos los teléfonos para almacenar 
  public auxtelf ="";
  public auxPais ="";


  public semana = [ // dias a almacenar en la bdd
    {val:'Lunes', isChecked: false},
    {val:'Martes', isChecked: false},
    {val:'Miercoles', isChecked: false},
    {val:'Jueves', isChecked: false},
    {val:'Viernes', isChecked: false},
    {val:'Sábado', isChecked: false},
    {val:'Domingo', isChecked: false}
  ];

  public horario: any = { //horas a almacenar en la bdd
    hora1: "",
    hora2: "",
    hora3: "",
    hora4: ""
  };
  moreHora: boolean = false; // para saber si agrego las dos ultimas horas

  public titulosacademicos: any = []; // todos títulos a almacenar en la bdd
  public auxtitulos: any = [];


  public certificadosacademicos: any = []; // todos títulos a almacenar en la bdd
  public auxcertificados: any = [];

  public location: any = {
    latitude: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.latitude,
    longitude: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.longitude,
    address: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.address,
    referencia: JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.referencia
  }; //ubicacion del local


  constructor(private alerta: AlertasService,
              public frmBuilder: FormBuilder,
              private FireSave: SaveinfirebaseService,
              private sortPipe: SortPipe,
              private alertController: AlertController,
              public modalCtrl: ModalController,
              public nav: NavController,
              public detecchange: ChangeDetectorRef,
              private ngZone: NgZone

              ) { 
              }

  async ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'register_profesional_info'});
        /** CARGA Y ORDENA LISTA DE PAISES */
        this.cargaYordena(); // carga y ordena lista de paises

        /** CARGA LISTA DE ESPECIALIDADES ORDENADAS */
        this.OrderDocumentsbyName('especialidades');


    /** FORMULARIO DOCTOR */
    this.tmp = JSON.parse(localStorage.getItem('datosmedicos')); //carga de loclstorage
    this.certificadosacademicos = this.tmp.certificados;
    for (let x = 0; x < this.certificadosacademicos.length; x++) {
      if(this.certificadosacademicos[x].name > 36){
        this.auxcertificados.push({name: this.certificadosacademicos[x].name.substr(0,36) + '...'});
      }else {
        this.auxcertificados.push({name: this.certificadosacademicos[x].name});
      }
    }

    this.semana = this.tmp.diaatencion;
    this.horario.hora1 = this.tmp.horarioatencion.h1;
    this.horario.hora2 = this.tmp.horarioatencion.h2;
    this.horario.hora3 = this.tmp.horarioatencion.h3;
    this.horario.hora4 = this.tmp.horarioatencion.h3;

    this.location.latitude = this.tmp.ubicacion.latutide;
    this.location.longitude = this.tmp.ubicacion.longitude;
    this.location.address = this.tmp.ubicacion.address;
    this.location.referencia = this.tmp.ubicacion.referencia;

    this.emergencia = this.tmp.emergencia;
    console.log('-----------------------------------------'+this.emergencia.isChecked+" "+this.emergencia.valor)

    this.otrosServicios = this.tmp.servicioadicional;
    for (let x = 0; x < this.otrosServicios.length; x++) {
      if(this.otrosServicios[x].name > 36){
        this.otrosServiciosMostrar.push({name: this.otrosServicios[x].name.substr(0,36) + '...'});
      }else {
        this.otrosServiciosMostrar.push({name: this.otrosServicios[x].name});
      }
    }

    this.telefonos = this.tmp.telefonos;
  
    this.titulosacademicos = this.tmp.titulos;
    for (let x = 0; x < this.titulosacademicos.length; x++) {
      if(this.titulosacademicos[x].name > 36){
        this.auxtitulos.push({name: this.titulosacademicos[x].name.substr(0,36) + '...'});
      }else {
        this.auxtitulos.push({name: this.titulosacademicos[x].name});
      }
    }
  

    this.frmDoctor = this.frmBuilder.group({
      profesion: this.tmp.sigla,
      cedula: new FormControl(this.tmp.cedula,Validators.compose([Validators.required])),
      nombre: new FormControl({value:JSON.parse(localStorage.getItem('user')).displayName,disabled:true}, 
                              Validators.compose([
                                 Validators.required,
                                 Validators.minLength(6)
            ])),
      paisorigen: new FormControl(this.tmp.paisorigen, Validators.compose([Validators.required])),
      especialidad: new FormControl(this.tmp.especialidadp, Validators.compose([Validators.required])),
      otrasEspecialidades: new FormControl(this.tmp.otrasespecialidades, Validators.compose([])),
      anio: new FormControl(this.tmp.anioslabor,Validators.compose([Validators.required])),
      vconsulta: new FormControl(this.tmp.vconsulta,Validators.compose([Validators.required])),

    });
    

   





        this.frmDoctor.valueChanges.subscribe(console.log); // imprime cada cambio el 
        this.detecchange.detectChanges();
  // CARGAR MINI MAPA PARA CAPTURAR DIRECCION 
  

  }


  async ionViewDidEnter() {
    this.location.latitude= JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.latitude,
    this.location.longitude=  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.longitude,
    this.location.address=  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.address,
    this.location.referencia=  JSON.parse(localStorage.getItem('datosmedicos')).ubicacion.referencia
    

  }



/**
 * Retorna una lista tipo Array [] = { id, name}
 * @param coleccion nombre de la coleccion a capturar debe tener id y name
 */
  async OrderDocumentsbyName(coleccion: string) {
    let lista: any= [];
    await this.FireSave.getDocuments(coleccion).then(res => {
      res.docs.forEach(doc => {
        if(doc.data().name != undefined){
          lista.push({id:doc.data().id,name:doc.data().name});
        }
      });
    }, err => console.log(err));
    //reordena la lista
    this.sortedEspecialidades = await this.sortPipe.transform(lista,'asc','name');

  }
  /**
   * Carga y ordena paises
   *  */
  async cargaYordena(){
      /*--------------------------- CARGAR LISTA DE PAISES Y ORDENA --------------------*/
      await this.FireSave.getPaises().then(res => {
        res.docs.forEach(doc => {
          // this.Lpais =doc.data().name;
          this.ListaPais.push({id:doc.data().id,name:doc.data().name});
        });
     }, err => console.log(err));
     /** reordena de manera ascendentie */
     this.sortedArr = await this.sortPipe.transform(this.ListaPais,'asc','name');
  }


  
  segmentChanged(ev: any) {
    this.isDoctor = !this.isDoctor;
  }
/**
 * Agregar srvicios adicionales que presta un doctor
 */
  async AddServices() {
    const alertPrompt = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Servicios adicionales que presta',
      mode: 'ios',
      inputs: [
        {
        name: 'detalle',
        type: 'text',
        placeholder: 'Ej: Cuidado intensivo ',
        value: '',
        id: 'detalle1',
      }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'gris',
          handler: () => {
            console.log('cancelado');
          }
        },
        {
          text: 'Agregar',
          cssClass: 'gris',
          handler: (data) => {
            if (data.detalle.toString() != ''){
              let cadena = data.detalle.toString().toLowerCase();
              cadena = cadena.charAt(0).toUpperCase() + cadena.slice(1);
              if(data.detalle.length > 36){
                this.otrosServiciosMostrar.push({name: cadena.substr(0,36) + '...'});
              } else{
                this.otrosServiciosMostrar.push({name: cadena});
              }
              this.otrosServicios.push({name:data.detalle});
            }            
          }
        }
      ]
    });
    await alertPrompt.present();
  }
/**
 * Agregar todos los telefonos disponibles de un doctor
 */
async AddTelefonos() {
  const alertPrompt = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Agregue un teléfono de contacto',
    mode: 'ios',
    inputs: [
      {
      name: 'telf',
      type: 'number',
      placeholder: 'Ej1: 0999999999     Ej2: 062999999',
      value: this.auxtelf,
      id: 'telf',
    }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'gris',
        handler: (data) => {
          this.auxtelf = "";
        }
      },
      {
        text: 'Add',
        cssClass: 'gris',
        handler: (data) => {
          this.auxtelf = data.telf;
          if (data.telf.length >= 9 && data.telf.length <= 13){
            if(data.telf.length > 10){
              console.log(data.telf[0]);
              console.log(data.telf.length);
              if(data.telf.length >= 11 && data.telf.length <= 13){
                this.telefonos.push({name: '+' + data.telf});
                this.auxtelf = "";
              }else {
                this.alerta.showToast('Telefono incorrecto',1000,'middle');
                this.AddTelefonos();
              }
            }else {
              this.telefonos.push({name: data.telf});
              this.auxtelf = "";
            }
          }else {
            this.alerta.showToast('Telefono incorrecto',1000,'middle');
            this.AddTelefonos();
          }
        }
      }
    ]
  });
  await alertPrompt.present().then(result => {
    document.getElementById('telf').setAttribute('maxLength','10');
    document.getElementById('telf').setAttribute('minLength','9');
  });
}

/**
 * Agrega titulo o certificado
 * @param tipo tipo titulo o certificado
 */
async AddAcademico(tipo: string, index: any) {
  console.log(this.certificadosacademicos);
  console.log(this.titulosacademicos);
  if (tipo == 'titulo'){
    const alertPrompt = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Escriba los datos del título',
      mode: 'ios',
      inputs: [
        {
        name: 'name',
        type: 'text',
        placeholder: 'Nombre del título.',
        value: index>-1?this.titulosacademicos[index].name:'',
        id: 'name',
      },
      {
        name: 'institucion',
        type: 'text',
        placeholder: 'Nombre de la institución.',
        value: index>-1?this.titulosacademicos[index].institucion:'',
        id: 'institucion',
      },
      {
        name: 'fecha',
        type: 'date',
        label: 'fecha',
        placeholder: 'Fecha de registro del título.',
        value: index>-1?this.titulosacademicos[index].fecha:'',
        id: 'fecha',
      },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'gris',
          handler: () => {
            console.log('cancelado');
          }
        },
        {
          text: 'Agregar',
          cssClass: 'gris',
          handler: (data) => {
            if (data.name != "" && data.institucion != "" && data.fecha != ""){
              let titulo = "" + data.name.toString().toLowerCase();
              let institucion = "" + data.institucion.toString().toLowerCase();
              titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
              institucion = institucion.charAt(0).toUpperCase() + institucion.slice(1);
              if (index == undefined){
                if(titulo.length > 36){
                  this.auxtitulos.push({name: titulo.substr(0,36) + '...'});
                }else {
                  this.auxtitulos.push({name: titulo});
                }

                this.titulosacademicos.push({name: titulo, institucion: institucion, fecha: data.fecha});  
              }else {
                if(titulo.length > 36){
                  this.auxtitulos[index] = ({name: titulo.substr(0,36) + '...'});
                }else {
                  this.auxtitulos[index] = ({name: titulo});
                }

                this.titulosacademicos[index] =({name: titulo, institucion: institucion, fecha: data.fecha}); 
              }
            } else {
              this.alerta.showToast('Llene todo los campos',500,'middle');
              this.AddAcademico('titulo',index);
            }           
          }
        }
      ]
    });
    await alertPrompt.present();
  } else {
    const alertPrompt = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Escriba los datos del certificado',
      mode: 'ios',
      inputs: [
        {
        name: 'name',
        type: 'text',
        placeholder: 'Nombre del certificado.',
        value: index>-1?this.certificadosacademicos[index].name:'',
        id: 'name',
      },
      {
        name: 'institucion',
        type: 'text',
        placeholder: 'Nombre de la institución.',
        value: index>-1?this.certificadosacademicos[index].institucion:'',
        id: 'institucion',
      },
      {
        name: 'fecha',
        type: 'date',
        label: 'fecha',
        placeholder: 'Fecha de registro del título.',
        value: index>-1?this.certificadosacademicos[index].fecha:'',
        id: 'fecha',
      },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'gris',
          handler: () => {
            console.log('cancelado');
          }
        },
        {
          text: 'Agregar',
          cssClass: 'gris',
          handler: (data) => {
            if (data.name != "" && data.institucion != "" && data.fecha != ""){
              let titulo = "" + data.name.toString().toLowerCase();
              let institucion = "" + data.institucion.toString().toLowerCase();
              titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
              institucion = institucion.charAt(0).toUpperCase() + institucion.slice(1);
              if (index == undefined){
                if(titulo.length > 36){
                  this.auxcertificados.push({name: titulo.substr(0,36) + '...'});
                }else {
                  this.auxcertificados.push({name: titulo});
                }

                this.certificadosacademicos.push({name: titulo, institucion: institucion, fecha: data.fecha});  
              }else {
                if(titulo.length > 36){
                  this.auxcertificados[index] = ({name: titulo.substr(0,36) + '...'});
                }else {
                  this.auxcertificados[index] = ({name: titulo});
                }

                this.certificadosacademicos[index] =({name: titulo, institucion: institucion, fecha: data.fecha}); 
              }
            } else {
              this.alerta.showToast('Llene todo los campos',500,'middle');
              this.AddAcademico('titulo',index);
            }           
          }
        }
      ]
    });
    await alertPrompt.present();
  }

}
/**
 * elimina elemento de un array con el index
 * @param index numero de posicion en el array
 */
  async deleteService(index: any, tipo: any){
    if (tipo === 'actv'){
      this.otrosServicios.splice(index,1);
      this.otrosServiciosMostrar.splice(index,1);
    } else if (tipo == 'tlf'){
      this.telefonos.splice(index,1);
    } else if (tipo == 'titulo') {
      this.auxtitulos.splice(index,1);
      this.titulosacademicos.splice(index,1);
    } else if (tipo == 'certificado') {
      this.auxcertificados.splice(index,1);
      this.certificadosacademicos.splice(index,1);
    }
  }
/**
 * Muestra el formulario apra obtener mi ubicacion
 */
  async GetUbicacion() {
    this.nav.navigateForward(['/miubicacion']);
    
  }
  imprimeDias(ev) {
    console.log(this.semana);
  }
  async dismiss(){
    this.modalCtrl.dismiss({
      'dismissed':true
    });
  }

  RegisDoc(valores: any) {
    // console.log(valores);
    // ALMACENA LOS DATOS  DEL FORMULARIO VALIDADOS

    let tmp = JSON.parse(localStorage.getItem('datosmedicos'));
            tmp.nombre = JSON.parse(localStorage.getItem('user')).displayName;
            tmp.sigla = valores.profesion;
            tmp.cedula = valores.cedula;
            tmp.anioslabor = valores.anio;
            tmp.paisorigen = valores.paisorigen;
            tmp.especialidadp = valores.especialidad;
            tmp.otrasespecialidades = valores.otrasEspecialidades;
            tmp.vconsulta = valores.vconsulta;
    
    // verifica variables fueras del formulario
    let faltanVariables = [];
    
    if(this.telefonos.length <= 0){ //verifica telefonos
      faltanVariables.push('- Telefono de contacto <br/>');
    }
    if(this.horario.hora1 == "" && this.horario.hora2 == ""){ //verifica horario
      faltanVariables.push('- Horario de atención <br/>');
    }
    
    let acsemana = 0; //verifica semana
    for (let x = 0; x < this.semana.length; x++) {
      if (this.semana[x].isChecked){
        acsemana++;
      }
    }
    if (acsemana<=0){
      faltanVariables.push('- Seleccione el día de semana que va a laborar <br/>');
    }

    if(this.titulosacademicos.length <= 0){ //verifica titulos academicos
      faltanVariables.push('- Ingresar por lo menos 1 título académico <br/>');
    }
    if (this.certificadosacademicos.length <= 0){ //verifica certificados
      faltanVariables.push('- Ingresar certificados <br/>');
    }
    
    if (this.location.latitude == "" || this.location.longitude ==""){
      faltanVariables.push ('- Es obligatorio agregar la ubicación de su consultorio médico');
    }

     // VERIFICA SI FALTAN DATOS Y ENVIA UN MENSAJE AL USUARIO
    if(faltanVariables.length > 0){ //si faltan datos por llenar enviar mensaje de alerta
      let element = '';
      for (let i = 0; i < faltanVariables.length; i++) {
        element = element + faltanVariables[i];
        
      }
       this.alerta.alertaSimple2('Debe completar todos los campos','Le faltan los siguientes datos', element)
    }else{// verificar si faltan dato adicionales
      tmp.telefonos = this.telefonos;

      tmp.horarioatencion.h1 = this.horario.hora1;
      tmp.horarioatencion.h2 = this.horario.hora2;
      tmp.horarioatencion.h3 = this.horario.hora3;
      tmp.horarioatencion.h4 = this.horario.hora4;

      tmp.diaatencion = this.semana;

      tmp.titulos = this.titulosacademicos;

      tmp.certificados = this.certificadosacademicos;

      tmp.servicioadicional = this.otrosServicios;

      tmp.ubicacion.latitude = this.location.latitude;
      tmp.ubicacion.longitude = this.location.longitude;
      tmp.ubicacion.address = this.location.address;
      tmp.ubicacion.referencia = this.location.referencia;

      tmp.emergencia = this.emergencia;


      //ALMACENAR DATOS EN LOCALSTORAGE
      localStorage.setItem('datosmedicos', JSON.stringify(tmp));



    }
    

    //---------------- SI LA VARIABLE DATOSMEDICOS ES DISTINTA A AUXDATOSMEDICOS ALMACENAR
    if(localStorage.getItem('datosmedicos') != localStorage.getItem('AUXdatosmedicos')) { // si hay cambios almacenar
      localStorage.setItem('AUXdatosmedicos',JSON.stringify(tmp));
      this.emergencia.isChecked = tmp.emergencia.isChecked;
      this.FireSave.saveDatosMedicos('datosmedicos');
      this.alerta.showToast('Datos almacenados',1500,'middle');
      this.nav.navigateForward('/dashboard');
    }
  

    
  }

  emergenciaCambia(){
    this.emergencia.isChecked = !this.emergencia.isChecked;
    console.log(this.emergencia);
  }

  valoremergencia(ev){
    this.emergencia.valor = ev.target.value;
  }
  // async saveDatosmedicos(event) {
  //   console.log(event.detail.value);
  //   console.log(this.horario.hora1);
  //   console.log(this.semana);
  //    }

     obtenerdatos(){
     //this.FireSave.saveDatosMedicos('datosmedicos');
       if(localStorage.getItem('datosmedicos') == localStorage.getItem('AUXdatosmedicos')) {
         console.log('si son iguales');
       }else{
         console.log('no son iguales');
       }
      
     }


    }
