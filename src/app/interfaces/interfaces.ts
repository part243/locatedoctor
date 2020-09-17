import { Timestamp } from 'rxjs';

/**
 * interfaz para usuarios
 */
export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
}

/**
 * crear variable tipo arreglo llamada para menu
 */
export interface ItfMenu {
    icon: string;
    name: string;
    redirectTo: string;
  }

/**
 * interefaz para medicos
 */
export interface datosMedicos {
    foto: string;
    nombre:string;
    anioslabor: string;
    cedula: string;
    certificados: Array<string>;
    diaatencion: [ // dias a almacenar en la bdd
        {val:string, isChecked: boolean},
        {val:string, isChecked: boolean},
        {val:string, isChecked: boolean},
        {val:string, isChecked: boolean},
        {val:string, isChecked: boolean},
        {val:string, isChecked: boolean},
        {val:string, isChecked: boolean}
      ];
    star:number;
    especialidadp: string;
    horarioatencion: {h3: string, h2: string, h1: string, h4: string};
    otrasespecialidades: Array<string>;
    paisorigen: string;
    servicioadicional: Array<string>;
    sigla: string;
    telefonos: Array<string>;
    titulos: Array<string>;
    emergencia: {valor: number, isChecked: boolean};
    vconsulta: number;
    ubicacion: {
        longitude: string, 
        latitude: string, 
        address: string, 
        referencia: string,
        country: string,
        locality: string,
        administrativeArea: string,
        subAdministrativeArea: string,
        subLocality: string

      };
}


export interface Coment{
  de:string;
  para:string;
  nombre: string;
  texto:string;
  timestamp:Date
}