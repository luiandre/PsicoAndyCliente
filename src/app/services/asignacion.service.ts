import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CargarAsignacion } from '../interfaces/cargar-asignaciones.interface';
import { Asignacion } from '../models/asignacion.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

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

  cargarAsignaciones(uid: string, desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/asignaciones/${uid}?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarAsignacion>(url, this.headers);
  }

  getAsignacionesProfesional(uid: string, desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/asignaciones/getAsignacionesProfesional/${uid}?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarAsignacion>(url, this.headers);
  }

  crearAsignacion(noticia: Asignacion) {
    const url = `${ base_url }/asignaciones`;
    return this.http.post<CargarAsignacion>(url, noticia, this.headers);
  }

  eliminarAsignacion(id: string) {
    const url = `${ base_url }/asignaciones/${ id }`;
    return this.http.delete<CargarAsignacion>(url, this.headers);
  }
}
