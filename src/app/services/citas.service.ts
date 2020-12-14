import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cita } from '../models/cita.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CitasService {

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

  getCitas(id: string) {
    const url = `${ base_url }/citas/${id}`;
    return this.http.get(url, this.headers)
    .pipe(
      map( (resp: any) => resp = resp.citas)
    );
  }

  crearCita(cita: Cita) {
    const url = `${ base_url }/citas`;
    return this.http.post(url, cita, this.headers);
  }

  actualizarCita(id: string, cita) {
    const url = `${ base_url }/citas/${ id }`;
    return this.http.put(url, cita, this.headers);
  }

  eliminarCita(id: string) {
    const url = `${ base_url }/citas/${ id }`;
    return this.http.delete(url, this.headers);
  }

  getCita(id: string) {
    const url = `${ base_url }/citas/getCita/${ id }`;
    return this.http.get(url, this.headers).pipe(
      map( (resp: any) => resp = resp.cita)
    );
  }
}
