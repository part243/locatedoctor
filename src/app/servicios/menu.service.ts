import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItfMenu } from '../interfaces/interfaces';
import { AutenticationService } from './autentication.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
      private http: HttpClient ,
      private AuthSrv: AutenticationService
           ) { }

cerraSesion() {
  this.AuthSrv.SignOut();
}
  getAllsMenu() {
    return this.http.get<ItfMenu[]>('/assets/datos/menu.json');
  }
}
