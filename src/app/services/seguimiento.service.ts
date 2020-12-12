import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Seguimiento } from '../models/seguimiento.model';
import { CargarSeguimiento } from '../interfaces/cargar-seguimientos.interface';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  // tslint:disable-next-line: variable-name
  private _id;
  constructor(  private http: HttpClient) { }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

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

  cargarSeguimientos(id: string, desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/seguimientos/${id}?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarSeguimiento>(url, this.headers);
  }

  crearSeguimiento(seguimiento: Seguimiento) {
    const url = `${ base_url }/seguimientos`;
    return this.http.post(url, seguimiento, this.headers);
  }

  actualizarSeguimiento(id: string, seguimiento) {
    const url = `${ base_url }/seguimientos/${ id }`;
    return this.http.put(url, seguimiento, this.headers);
  }

  getSeguimiento(id: string) {
    const url = `${ base_url }/seguimientos/getSeguimiento/${ id }`;
    return this.http.get(url, this.headers).pipe(
      map( (resp: any) => resp = resp.seguimiento)
    );
  }

  eliminarSeguimiento(id: string) {
    const url = `${ base_url }/seguimientos/${ id }`;
    return this.http.delete(url, this.headers);
  }
}
