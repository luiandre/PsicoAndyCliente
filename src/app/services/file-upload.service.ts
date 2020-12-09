import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(  private http: HttpClient) { }

  get headers() {
    return {
      headers: {
        'x-token': localStorage.getItem('token')
      }
    };
  }

  actualizarFoto( archivo: File, tipo: 'usuarios' | 'servicios' | 'noticias', id: string) {
      const url = `${ base_url }/upload/${ tipo }/${ id }`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      return this.http.put( url, formData, this.headers);
  }
}
