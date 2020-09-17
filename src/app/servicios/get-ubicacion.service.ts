import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetUbicacionService {

  constructor(private http: HttpClient) { }

  getDatos(){
    return this.http.get('https://ipinfo.io/json');
  }
}
