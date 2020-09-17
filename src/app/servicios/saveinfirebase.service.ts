import { Injectable } from '@angular/core';
import  * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics'
import { LoadingService } from './loading.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Coment } from '../interfaces/interfaces';
 
@Injectable({
  providedIn: 'root'
})
export class SaveinfirebaseService {

  private ComentCollection: AngularFirestoreCollection;
  constructor(
    public loading: LoadingService,
  ) { }

/**
 * Guarda pais en la collecion pais
 * @param id identificacion del pais
 * @param name nombre del pais
 */
  async addPais( id: number, name: string) {
   // return await firebase.firestore().collection('pais').add({id, name});
  }
/**
 * obtiene el id de cualquier documento en datosmedicos
 * @param cedula dato unico a buscar en el documento
 */
  async getIdfromAnyDocument(cedula: any){
    const document = firebase.firestore().collection('datosmedicos');
    return await new Promise<any>((resolve, reject) => {
      document  
              .where('cedula','==',cedula).get().then(
                res => {resolve(res.docs)},
                err => {reject(err)}
      )
    });
  }

/**
 * Obtiene comentarios de un médico limitando
 * @param cedula cédula del médico para buscar comentarios
 */
  async getComentarios(cedula: string, limit: number, orden: any){
    const coments = firebase.firestore().collection('comentarios');
    return await new Promise<any>((resolve, reject) =>{
        coments.where('para','==',cedula)
               .orderBy('timestamp', orden).limit(limit)
               .get()
               .then(
                res => resolve(res.docs),
                err => reject(err)
               )
    });
  }

  /**
 * Obtiene todos los comentarios de un medico
 * @param cedula cédula del médico para buscar comentarios
 */
async getAllsComentarios(cedula: string, orden: any){
  const coments = firebase.firestore().collection('comentarios');
  return await new Promise<any>((resolve, reject) =>{
      coments.where('para','==',cedula)
             .orderBy('timestamp', orden)
             .get()
             .then(
              res => resolve(res.docs),
              err => reject(err)
             )
  });
}

  /**
   * obtiende id de documento que se encuentre en mi área
   * @param cedula cedula del documento a buscar
   */
  async getIdfromDocument(cedula: any){
    const document = firebase.firestore().collection('datosmedicos');
    return await new Promise<any>((resolve, reject) => {
      document.where('ubicacion.administrativeArea','==',JSON.parse(localStorage.getItem('myubicacion')).administrativeArea)
              .where('ubicacion.subAdministrativeArea','in',[JSON.parse(localStorage.getItem('myubicacion')).subAdministrativeArea,''])      
              .where('cedula','==',cedula).get().then(
                res => {resolve(res.docs)},
                err => {reject(err)}
      )
    });
  }
/**
 * Obtiene lista de paises de la coleccion pais
 */
  async getPaises() {
    return await new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('pais').get().then(res => {resolve(res); }, err => {reject(err); });
    });

  }
/**
 * Obtiene Pais en base al codigo del país
 */
async getPais(CodePais: any) {
  return await new Promise<any>((resolve, reject) => {
    firebase.firestore().collection('pais')
                        .where('id',"==",CodePais)
                        .get().then(res => {resolve(res); }, err => {reject(err); });
  });

}
  /**
 * Obtiene lista de paises de la coleccion pais
 */
async getDatosdeMedicos() {
      //google analitico
      firebase.analytics().logEvent('consulta',{'coleccion':'medicos'});
  return await new Promise<any>((resolve, reject) => {
    firebase.firestore().collection('datosmedicos').doc(JSON.parse(localStorage.getItem('user')).email).get().then(res => {resolve(res); }, err => {reject(err); });
  });

}
/**
 * Agregar id y name a cualquier coleccion
 * @param id identificacion del documento
 * @param name 
 * @param coleccion
 */
  async addInColeccion( id: number, name: string, coleccion: string) {
    return await firebase.firestore().collection(coleccion).add({id, name});
  }

  async getDocuments(coleccion: string){
    //google analitico
    firebase.analytics().logEvent('consulta',{'coleccion':coleccion});
    return await new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(coleccion).get().then(res =>{resolve(res);}, err => {reject(err);});
    })
  }

  /**
   * obtiene cualquier documento sabiendo su id
   * @param coleccion nombre de la coleccion
   * @param documento nombre del documento
   */
  async getDocumentEspecifico(coleccion: string, Iddocumento: string){
    //google analitico
    firebase.analytics().logEvent('consulta',{'conleccion':coleccion});
    return await new Promise<any>((resolve, reject) => {
      firebase.firestore().collection(coleccion)
                          .doc(Iddocumento).get()
                          .then(
                              res =>{resolve(res);},
                              err => {reject(err);}
                          );
    })
  }
/**
 * guarda/actualiza documento en firebase a partir de una coleccion
 * @param coleccion coleccion donde guardar/editar el documento
 */
  async saveDatosMedicos(coleccion: string){
    //google analitico
    firebase.analytics().logEvent('consultorio_nuevo',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    //identificar si ya existe 
    let id = JSON.parse(localStorage.getItem('user')).email;
    let datosmedicos = JSON.parse(localStorage.getItem('datosmedicos'));
    //this.loading.present('Guardando...');
          return await new Promise<any>((resolve, reject) => {
            firebase.firestore().collection(coleccion) //coleccion datosmedicos
                                .doc(id) //datosmedicos
                                .set(datosmedicos) // array de datos medicos
                                .then(
                                    res =>{resolve(res);},
                                    err => {reject(err);}
                                );
           // this.loading.dismiss();
          });
        
  }

  /**
   * Filtrar todos los médicos cercanos a mi ciudad por nombre
   * @param textoAfiltrar el nombre a buscar
   */
  async getMedicFromMyCity(textoAfiltrar: any){
    //google analitico
    firebase.analytics().logEvent('consulta',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    let datosmedicosresf = firebase.firestore().collection('datosmedicos');
    return await new Promise<any>((resolve, reject) => {
    //filtrar médicos cercanos en mi ciudad 
    datosmedicosresf .where('ubicacion.administrativeArea','==',JSON.parse(localStorage.getItem('myubicacion')).administrativeArea)
                    .where('ubicacion.subAdministrativeArea','in',[JSON.parse(localStorage.getItem('myubicacion')).subAdministrativeArea,''])      
                    .where('nombre','>=',textoAfiltrar)
                    .limit(50)
                    .get()
                        .then( res =>{
                               resolve(res.docs);
                               //console.log(res.docs);
                          },
                          err => {reject(err);}
                          ); //res.docs[0].data()
    });
  } 


  /**
   * Filtrar todos los médicos cercanos a mi ciudad por especialidad
   * @param codigo el nombre a buscar
   */
  async getMedicFromEspecialidadMyCity(codigo: any){
    //google analitico
    firebase.analytics().logEvent('consulta',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    let datosmedicosresf = firebase.firestore().collection('datosmedicos');
    return await new Promise<any>((resolve, reject) => {
    //filtrar médicos cercanos en mi ciudad 
    datosmedicosresf.where('especialidadp','==',codigo)
                    .where('ubicacion.administrativeArea','==',JSON.parse(localStorage.getItem('myubicacion')).administrativeArea)
                    .where('ubicacion.subAdministrativeArea','in',[JSON.parse(localStorage.getItem('myubicacion')).subAdministrativeArea,''])
                    .limit(50)
                    .get()
                        .then( res =>{
                               resolve(res.docs);
                              //  if(res.docs.length > 0){
                              //     console.log('si encontro medico con especialidad');
                              //  }
                          },
                          err => {reject(err);}
                          ); //res.docs[0].data()
    });
  }

 /**
   * Filtrar todos los médicos cercanos a mi ciudad por especialidades adicionales
   * @param codigo el nombre a buscar
   */
  async getMedicFromOtrasEspecialidadesMyCity(codigo: any){
    //google analitico
    firebase.analytics().logEvent('consulta',{'user_id':JSON.parse(localStorage.getItem('user')).email});
    let datosmedicosresf = firebase.firestore().collection('datosmedicos');
    return await new Promise<any>((resolve, reject) => {
    //filtrar médicos cercanos en mi ciudad 
    
    datosmedicosresf.where('ubicacion.administrativeArea','==',JSON.parse(localStorage.getItem('myubicacion')).administrativeArea)
                    .where('ubicacion.subAdministrativeArea','in',[JSON.parse(localStorage.getItem('myubicacion')).subAdministrativeArea,''])
                    .where('otrasespecialidades','array-contains',codigo)
                    .limit(50)
                    .get()
                        .then( res =>{
                               resolve(res.docs);
                            //    if(res.docs.length > 0){
                            //     console.log('si encontro medico con otrasespecialidades');
                            //  }
                          },
                          err => {reject(err);}
                          ); //res.docs[0].data()
    });
  }

/**
 * OBTIENE TODAS LAS CALIFICACIONES DE UN DOCTOR
 * @param cedula cedula del doctor para obtener la calificación
 */
  async getStar(cedula: any){
    //google analitico
    firebase.analytics().logEvent('view_star',{'user_id':JSON.parse(localStorage.getItem('user')).email,
                                               'medico_id':cedula});
    let docsStar = firebase.firestore().collection('star');
    return await new Promise<any>((resolve, reject) => {
                docsStar.where('para','==',cedula)
                        .get()
                        .then(
                              res =>{resolve(res.docs);},
                              err => {reject(err);}
                          );
    });
  }

/**
 * OBTIENE TODOS LOS COMENTARIOS DE UN DOCTOR
 * @param cedula cedula del doctor para obtener la calificación
 */
async getComment(cedula: any){
    //google analitico
    firebase.analytics().logEvent('view_comment',{'user_id':JSON.parse(localStorage.getItem('user')).email,
                                                  'medic_id':cedula});
  let docsComment = firebase.firestore().collection('comentarios');
  return await new Promise<any>((resolve, reject) => {
            docsComment.where('para','==',cedula)
                      .get()
                      .then(
                            res =>{resolve(res.docs);},
                            err => {reject(err);}
                        );
  });
}


/**
 * OBTIENE COMENTARIO DE USUARIO
 * @param cedula cedula del doctor para obtener la calificación
 */
async getCommentFromuser(cedula: any){
  //google analitico
  firebase.analytics().logEvent('view_comment',{'user_id':JSON.parse(localStorage.getItem('user')).email,
                                                'medic_id':cedula});
let docsComment = firebase.firestore().collection('comentarios');
return await new Promise<any>((resolve, reject) => {
          docsComment.where('para','==',cedula)
                    .where('de','==',JSON.parse(localStorage.getItem('user')).email)
                    .get()
                    .then(
                          res =>{resolve(res.docs);},
                          err => {reject(err);}
                      );
});
}

/**
 * OBTIENE CALIFICACION DE USUARIO
 * @param cedula cedula del doctor para obtener la calificación
 */
async getStarFromuser(cedula: any){
  //google analitico
  firebase.analytics().logEvent('view_comment',{'user_id':JSON.parse(localStorage.getItem('user')).email,
                                                'medic_id':cedula});
let docsComment = firebase.firestore().collection('star');
return await new Promise<any>((resolve, reject) => {
          docsComment.where('para','==',cedula)
                    .where('de','==',JSON.parse(localStorage.getItem('user')).email)
                    .get()
                    .then(
                          res =>{resolve(res.docs);},
                          err => {reject(err);}
                      );
});
}

/**
 * 
 * @param idComment id comentario
 * @param idStar id star
 * @param texto comentario
 * @param star calificacion
 * @param para cedula del medico
 */
async setStarAndComment(idComment:string,idStar: string,texto:string,star: number, para: string){
  //console.log(idComment+ ' '+ idStar + ' '+ texto + ' ' + star + ' '+ para);
  if (star != 0){
    firebase.firestore().collection('star').doc(idStar).set({'para':para,'calificacion':star,'de':JSON.parse(localStorage.getItem('user')).email}); 
  }

  if(texto != ""){
    return await new Promise<any>((resolve, reject) => {
      firebase.firestore().collection('comentarios').doc(idComment).set({'nombre':JSON.parse(localStorage.getItem('user')).displayName,'para':para,'texto':texto,'de':JSON.parse(localStorage.getItem('user')).email, 'timestamp': firebase.firestore.FieldValue.serverTimestamp()}).then(res=>console.log(res),err=>console.log(err));
  });
  }


}

}
