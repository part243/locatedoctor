import {NavController, MenuController, ActionSheetController} from '@ionic/angular';
import { Component, OnInit, inject, Inject, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AutenticationService } from '../../../servicios/autentication.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../servicios/loading.service';
import { AlertasService } from '../../../servicios/alertas.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadfileService } from '../../../servicios/uploadfile.service';
import { Platform } from '@ionic/angular';
// import { Crop, CropOptions } from '@ionic-native/crop/ngx';
import { ImagePicker} from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { SaveinfirebaseService } from 'src/app/servicios/saveinfirebase.service';
import { datosMedicos } from '../../../interfaces/interfaces';
import { Crop } from '@ionic-native/crop/ngx';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  // tslint:disable-next-line:no-input-rename
  captureDataUrl: string;
  fileUrl: any = null;
  respData: any;

  croppedImagepath = "";
  AUXUrl = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 10
  };


  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  verifiedMostrar: boolean;
  emailVerified: boolean;
  save: boolean;

  values = {
    email: JSON.parse(localStorage.getItem('user')).email,
    password: ''
  }
  validationMessages = {
    nombre: [
            {type: 'required', message: 'Ingrese un nombre.'},
            {type: 'minlength', message: 'Escriba un nombre válido'}
    ],
    oldPass: [
      {type: 'required', message: 'Ingrese contraseña antigua.'},
      {type: 'minlength', message: 'Mínimo 6 caracteres'}
    ],
    newPass: [
      {type: 'required', message: 'Ingrese contraseña nueva.'},
      {type: 'minlength', message: 'Mínimo 6 caracteres'}
    ],
    confirmPass: [
      {type: 'required', message: 'Repita la nueva contraseña.'},
      {type: 'minlength', message: 'Mínimo 6 caracteres'}
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
    private upload: UploadfileService,
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    public file: File,
    private imagePicker: ImagePicker,
    public platform: Platform,
    private firesave: SaveinfirebaseService
    ) {
   }

  ngOnInit() {
    
    //google analitico
    firebase.analytics().logEvent('page_view',{'page_title':'profile'});

    //obtener foto de perfil del usuario actual
    this.loading.present('Espere...');
    this.upload.getFile(JSON.parse(localStorage.getItem('user')).email,'imagenes/perfil','profile').then(
      res => {
        this.croppedImagepath=res;
        this.loading.dismiss();
      },err => {
        this.croppedImagepath="";
        this.loading.dismiss();
      }
    );

    // validamos formulario
    this.validationsForm = this.frmBuilder.group({
      nombre: new FormControl(JSON.parse(localStorage.getItem('user')).displayName, Validators.compose([
        Validators.minLength(2),
        Validators.required
      ])),
      oldPass: new FormControl('$$$$$$', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])),
      newPass: new FormControl('$$$$$$', Validators.compose([
        Validators.required,
        Validators.minLength(6),
      ])),
      confirmPass: new FormControl('$$$$$$', Validators.compose([
        Validators.required,
      ])),
    },
      {validator: this.matchingPasswords('newPass', 'confirmPass')}
    );

    // obtener datos del localstore
    this.emailVerified = this.authSrv.isEmailVerified;
    this.verifiedMostrar = JSON.parse(localStorage.getItem('user')).emailVerified;
     

  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): {[key: string]: any} => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  onKeydown() {
    this.validationsForm.controls.confirmPass.setValue('');
  }

  focusFunction() {

    if (!this.validationsForm.controls.oldPass.value) {
        this.validationsForm.controls.oldPass.setValue('$$$$$$');
    }
    if (!this.validationsForm.controls.newPass.value) {
      this.validationsForm.controls.newPass.setValue('$$$$$$');
      this.validationsForm.controls.confirmPass.setValue('$$$$$$');
    }


  }





  // pickImage() {
  //   this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0; i < results.length; i++) {
  //       this.cropImage(results[i]);
  //     } 
  //   }, (err) => {
  //     alert(err);
  //   });
  // }

  pickImage(sourceType) {
    const options: CameraOptions = {
      allowEdit:true,
      quality: 10,
      sourceType: sourceType,
     // cameraDirection: this.camera.Direction.FRONT,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.cropImage(imageData)
    }, (err) => {
      // Handle error
    });
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 10 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
      this.AUXUrl = base64;
      this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Seleccione su imagen de perfil",
      cssClass:"my-custom-class",
      mode:'ios',
      buttons: [{
        text: 'Galeria',
        icon: 'images',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Cámara',
        icon:'camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        icon:'close',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  // showCroppedImage(ImagePath) {
  //   this.isLoading = true;
  //   const copyPath = ImagePath;
  //   const splitPath = copyPath.split('/');
  //   const imageName = splitPath[splitPath.length - 1];
  //   const filePath = ImagePath.split(imageName)[0];
  //   this.file.readAsDataURL(filePath, imageName).then(base64 => {
  //     this.croppedImagepath = base64;
  //     this.isLoading = false;
  //   }, error => {
  //     alert('Error in showing image' + error);
  //     this.isLoading = false;
  //   });
  // }
  // getMedia(): Promise<any> {
  //   // Get Image from ionic-native's built in camera plugin
  //   return this.camera.getPicture(this.optionsCam)
  //     .then((fileUri) => {
  //       // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
  //       // Only giving an android example as ionic-native camera has built in cropping ability
  //       if (this.platform.is('ios')) {
  //         return fileUri;
  //       } else if (this.platform.is('android')) {
  //         // Modify fileUri format, may not always be necessary
  //         fileUri = 'file://' + fileUri;
  //         /* Using cordova-plugin-crop starts here */
  //         const imgcortada = this.crop.crop(fileUri, { quality: 40, targetWidth: -1, targetHeight: -1 });

  //         return imgcortada;
  //       }
  //     })
  //     .then((path) => {
  //       // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
  //       this.alerta.alertaSimple('Cropped Image Path!: ', '', path);
  //       return path;
  //     });
  // }



  subirimagen() {
    if(this.AUXUrl){
      this.loading.present('subiendo foto');
      this.upload.upload2(this.croppedImagepath,
                          'imagenes/perfil/',
                          'profile',
                          JSON.parse(localStorage.getItem('user')).email
                        ).then(
                          res => {console.log(res);
                                  this.captureDataUrl = '';
                                  this.AUXUrl = '';
                                  this.loading.dismiss(); },
                          err => {console.log(err);
                            this.AUXUrl = '';
                                  this.loading.dismiss(); }
                        );
    }
  }

  sendData() {
    console.log(JSON.parse(localStorage.getItem('user')).emailVerified);
    if (this.validationsForm.controls.oldPass.value       === '$$$$$$' ||
          this.validationsForm.controls.newPass.value     === '$$$$$$' ||
          this.validationsForm.controls.confirmPass.value === '$$$$$$') {

            this.validationsForm.controls.oldPass.setValue('$$$$$$');
            this.validationsForm.controls.newPass.setValue('$$$$$$');
            this.validationsForm.controls.confirmPass.setValue('$$$$$$');
    }


// realizar almacenamiento
// password
    if (this.validationsForm.controls.oldPass.value != this.validationsForm.controls.newPass.value) {
      this.save = true;
      
      this.values.password = this.validationsForm.controls.oldPass.value;
      this.authSrv.SignIn(this.values).then(res => {
        console.log('guardar nuevo password')
        this.authSrv.updatePassword(this.validationsForm.controls.newPass.value);
        // this.validationsForm.controls.newPass.value
      }, err => {
              this.alerta.alertaSimple('Editar Perfil','Password','Password anterior incorrecto').then(() => console.log('pass almacenado'));
              return false;
        });

      // console.log(this.validationsForm.controls.newPass.value);
     }


    // NOMBRE 
    if (this.validationsForm.controls.nombre.value != JSON.parse(localStorage.getItem('user')).displayName) {
     this.save = true;
      // almacenar nombre en la nube
      this.authSrv.updateName(this.validationsForm.controls.nombre.value).then(() => console.log('nom almacenado'));

    }
    // VERIFICACION DE EMAIL
    if (this.emailVerified !=  JSON.parse(localStorage.getItem('user')).emailVerified) {
      // verificar email
      this.save = true;
      this.authSrv.SendVerificationMail()
      this.alerta.showToast('Le hemos enviado un email para verificar su cuenta.',3000,'top');

    }

    if (this.save === true) {
      this.loading.present('Almacenando datos');
      setTimeout(() => {
        this.loading.dismiss();
        this.authSrv.SignOut();
      }, 3000);
      
    }



  }

  /**
   * Busca datos de nédicos y almacena en localstorage
   */
 async gotoregisterConsultorio() {
   if(localStorage.getItem('datosmedicos') && localStorage.getItem('AUXdatosmedicos')) { // si estan en localstore no vuelve a consultar
   
    this.navega.navigateForward('/registro');
   }else { // recuperar datos de bdd
    await this.firesave.getDatosdeMedicos().then((res =>{ 
                  if(res.data() != undefined){ // si existen datos almacenados en la bdd recuperar y almacenar en localstorage
                      localStorage.setItem('datosmedicos', JSON.stringify(res.data()));
                      localStorage.setItem('AUXdatosmedicos', JSON.stringify(res.data()));
                      
                  }else{ // caso contrario generar varible sin datos y almacenar en localstorage
                    console.log('cliente nuevo');
                    let datosIniciales: datosMedicos = {
                      foto:"",
                      nombre: "",
                      anioslabor: "",
                      cedula: "",
                      certificados: [],
                      vconsulta:0,
                      emergencia: {valor: 0, isChecked: false},
                      diaatencion: [ // dias a almacenar en la bdd
                        {val:'Lunes', isChecked: false},
                        {val:'Martes', isChecked: false},
                        {val:'Miercoles', isChecked: false},
                        {val:'Jueves', isChecked: false},
                        {val:'Viernes', isChecked: false},
                        {val:'Sábado', isChecked: false},
                        {val:'Domingo', isChecked: false}
                      ],
                      star:0,
                      especialidadp: "",
                      horarioatencion: {h1: "", h2: "", h3: "", h4: ""},
                      otrasespecialidades: [],
                      paisorigen: "",
                      servicioadicional: [],
                      sigla: "Dro.",
                      telefonos: [],
                      titulos: [],
                      ubicacion: {longitude: "", 
                                  latitude: "",
                                  address: "", 
                                  referencia: "",        
                                  country: "",  
                                  locality: "",  
                                  administrativeArea: "",  
                                  subAdministrativeArea: "",  
                                  subLocality: "",  
                                },
                    };

                    localStorage.setItem('datosmedicos', JSON.stringify(datosIniciales));
                    localStorage.setItem('AUXdatosmedicos', JSON.stringify(datosIniciales));
                  }
                  this.navega.navigateForward('/registro');
    }), err => console.log(err));
   }

    
  }
}
