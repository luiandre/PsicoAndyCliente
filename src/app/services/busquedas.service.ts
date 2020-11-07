import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Noticia } from '../models/noticia.model';
import { Servicio } from '../models/servicio.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

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

  private transformarUsuarios( respuestas: any[]): Usuario[] {

    return respuestas.map(
      user => new Usuario(
        user.nombre,
        user.apellido,
        user.email,
        '',
        user.google,
        user.activo,
        user.img,
        user.rol,
        user.bio,
        user.uid
      ));
  }

  private transformarNoticias( respuestas: any[]): Noticia[] {

    return respuestas;
  }

  private transformarServicios( respuestas: any[]): Servicio[] {

    return respuestas;
  }

  buscar(tipo: 'usuarios'|'servicios'|'noticias', termino: string){

    const url = `${ base_url }/todo/coleccion/${ tipo }/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map( (resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(resp.respuesta);
            case 'servicios':
              return this.transformarServicios(resp.respuesta);
            case 'noticias':
              return this.transformarNoticias(resp.respuesta);
            default:
              break;
          }
        })
      );
  }

  buscarTodo( termino: string) {
    const url = `${ base_url }/todo/${termino}`;
    return this.http.get<any[]>(url, this.headers);
  }

  buscarUsuariosBusquedaRol( termino: string, rol: string) {
    const url = `${ base_url }/todo/usuariosChat/${rol}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
    .pipe(
      map( (resp: any) => resp = resp.usuarios)
    );
  }
}
