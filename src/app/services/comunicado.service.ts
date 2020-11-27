import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comunicado } from '../models/comunicado.model';
import { CargarComunicado } from '../interfaces/cargar-comunicados.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {

  constructor(  private http: HttpClient) { }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarComunicados(desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/comunicados?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarComunicado>(url, this.headers);
  }

  crearComunicado(comunicado: Comunicado) {
    const url = `${ base_url }/comunicados`;
    return this.http.post<CargarComunicado>(url, comunicado, this.headers);
  }

  actualizarComunicado(id: string, comunicado) {
    const url = `${ base_url }/comunicados/${ id }`;
    return this.http.put<CargarComunicado>(url, comunicado, this.headers);
  }

  eliminarComunicado(id: string) {
    const url = `${ base_url }/comunicados/${ id }`;
    return this.http.delete<CargarComunicado>(url, this.headers);
  }

  getComunicado(id: string) {
    const url = `${ base_url }/comunicados/${ id }`;
    return this.http.get<CargarComunicado>(url, this.headers).pipe(
      map( (resp: any) => resp = resp.comunicado)
    );
  }
}
