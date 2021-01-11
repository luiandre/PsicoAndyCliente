import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Sala } from '../models/sala.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SalasService {

  constructor(  private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  getSalas() {
    const url = `${ base_url }/salas`;
    return this.http.get(url, this.headers)
    .pipe(
      map( (resp: any) => resp = resp.salas)
    );
  }

  crearSala(uidDestino: string) {
    const url = `${ base_url }/salas/${uidDestino}`;
    return this.http.post(url, uidDestino, this.headers)
    .pipe(
      map( (resp: any) => resp = resp.sala)
    );
  }

  eliminarSala(uuid: string) {
    const url = `${ base_url }/salas/${ uuid }`;
    return this.http.delete(url, this.headers);
  }

  getSala(uuid: string) {
    const url = `${ base_url }/salas/${ uuid }`;
    return this.http.get(url, this.headers)
    .pipe(
      map( (resp: any) => resp = resp.sala)
    );
  }

  agregarSalaCon(uuid: string) {
    const url = `${ base_url }/salas/agregarSalaCon/${ uuid }`;
    return this.http.put(url, '', this.headers);
  }

  eliminarSalaCon(uuid: string) {
    const url = `${ base_url }/salas/eliminarSalaCon/${ uuid }`;
    return this.http.put(url, '', this.headers);
  }
}
