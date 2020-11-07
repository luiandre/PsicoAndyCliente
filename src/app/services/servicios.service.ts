import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CargarServicio } from '../interfaces/cargar-servicios.interface';
import { environment } from 'src/environments/environment';
import { Servicio } from '../models/servicio.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

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

  cargarServicios(desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/servicios?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarServicio>(url, this.headers);
  }

  crearServicio(servicio: Servicio) {
    const url = `${ base_url }/servicios`;
    return this.http.post<CargarServicio>(url, servicio, this.headers);
  }

  actualizarServicio(id: string, servicio) {
    const url = `${ base_url }/servicios/${ id }`;
    return this.http.put<CargarServicio>(url, servicio, this.headers);
  }

  eliminarServicio(id: string) {
    const url = `${ base_url }/servicios/${ id }`;
    return this.http.delete<CargarServicio>(url, this.headers);
  }

  getServicio(id: string) {
    const url = `${ base_url }/servicios/${ id }`;
    return this.http.get<CargarServicio>(url, this.headers)
    .pipe(
      map( (resp: any) => resp = resp.servicio)
    );
  }
}
