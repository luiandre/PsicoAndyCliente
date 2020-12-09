import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CargarNoticia } from '../interfaces/cargar-noticias.interface';
import { Noticia } from '../models/noticia.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

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

  cargarNoticias(desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/noticias?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarNoticia>(url, this.headers);
  }

  crearNoticia(noticia: Noticia) {
    const url = `${ base_url }/noticias`;
    return this.http.post<CargarNoticia>(url, noticia, this.headers);
  }

  actualizarNoticia(id: string, noticia) {
    const url = `${ base_url }/noticias/${ id }`;
    return this.http.put<CargarNoticia>(url, noticia, this.headers);
  }

  eliminarNoticia(id: string) {
    const url = `${ base_url }/noticias/${ id }`;
    return this.http.delete<CargarNoticia>(url, this.headers);
  }

  getNoticia(id: string) {
    const url = `${ base_url }/noticias/${ id }`;
    return this.http.get<CargarNoticia>(url, this.headers).pipe(
      map( (resp: any) => resp = resp.noticia)
    );
  }
}
