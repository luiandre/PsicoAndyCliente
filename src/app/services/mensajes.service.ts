import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { CargarNoticia } from '../interfaces/cargar-noticias.interface';
import { map } from 'rxjs/operators';
import { Mensaje } from '../models/mensaje.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

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

  cargarMensajes(para: string) {
    const url = `${ base_url }/mensajes/${para}`;
    return this.http.get<CargarNoticia>(url, this.headers).pipe(
        map( (resp: any) => resp = resp.mensajes)
    );
  }

  getUltimoRecibido(de: string) {
    const url = `${ base_url }/mensajes/ultimo/${de}`;
    return this.http.get<CargarNoticia>(url, this.headers).pipe(
        map( (resp: any) => resp = resp.mensaje)
    );
  }

  enviarMensaje(mensaje: Mensaje) {
    const url = `${ base_url }/mensajes`;
    return this.http.post(url, mensaje, this.headers);
  }

  activarPendiente(id: string){
    return this.http.put(`${base_url}/mensajes/activar/${id}`, this.headers);
  }

  desactivarPendiente(id: string){
    return this.http.put(`${base_url}/mensajes/desactivar/${id}`, this.headers);
  }
}
