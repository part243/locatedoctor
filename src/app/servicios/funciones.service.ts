import { Injectable } from '@angular/core';
import { analytics } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  public auxTlf: any;

  constructor() { }

/**
 * Verifica si una cadena ingresa es numero o string
 * @param cadena valor de la cadena que va a comprobar
 */
  stringIsNumber(cadena: any) {
    var x = +cadena; // made cast obvious for demonstration
    return x.toString() === cadena;
}

/**
 * Calcula distancia entre 2 puntos
 * @param lat1 latitud 1
 * @param lon1 longitud 1
 * @param lat2 latitud 2
 * @param lon2 longitud 2
 */
getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km   
}

/**
 * devuelve los item de atencion de un médico
 * @param item array de item
 */
DiasAtencion(dias){
  let NewVal: String;
  
    NewVal ="";
    if(// si atiende de lunes a viernes
      dias[0].isChecked == true &&
      dias[1].isChecked == true &&
      dias[2].isChecked == true &&
      dias[3].isChecked == true &&
      dias[4].isChecked == true &&
      dias[5].isChecked == false &&
      dias[6].isChecked == false
    ){ 
      NewVal="Lunes a Viernes"
    }else if ( // lunes a sábado
      dias[0].isChecked == true &&
      dias[1].isChecked == true &&
      dias[2].isChecked == true &&
      dias[3].isChecked == true &&
      dias[4].isChecked == true &&
      dias[5].isChecked == true &&
      dias[6].isChecked == false
    ){
      NewVal="Lunes a Sábado"
    }else if ( // lunes a domingo
      dias[0].isChecked == true &&
      dias[1].isChecked == true &&
      dias[2].isChecked == true &&
      dias[3].isChecked == true &&
      dias[4].isChecked == true &&
      dias[5].isChecked == true &&
      dias[6].isChecked == true
    ){
      NewVal="Lunes a Domingo"
    }else{
      dias.forEach((semana,index) => {
        if(semana.isChecked ==true){
          if (index == 0){
            NewVal = semana.val;
          }else{
            NewVal = NewVal + ", " + semana.val;
          }
        }
      });
    }
    return NewVal;
  };


}
