import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Historia } from '../models/historia.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HistoriasService {

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

  crearHistoria(historia: Historia) {
    const url = `${ base_url }/historias`;
    return this.http.post(url, historia, this.headers);
  }

  actualizarHistoria(id: string, historia) {
    const url = `${ base_url }/historias/${ id }`;
    return this.http.put(url, historia, this.headers);
  }

  getHistoria(id: string) {
    const url = `${ base_url }/historias/${ id }`;
    return this.http.get(url, this.headers).pipe(
      map( (resp: any) => resp = resp.historia)
    );
  }
}
