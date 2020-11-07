import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { PerfilForm } from '../interfaces/perfil-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(  private http: HttpClient,
                private router: Router,
                private ngZone: NgZone) {
    this.googleInit();
  }

  get rol(): 'ADMIN_ROL' | 'PROF_ROL' | 'USER_ROL' {
      return this.usuario.rol;
  }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  googleInit(){

    // tslint:disable-next-line: no-shadowed-variable
    return new Promise( resolve => {

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '642190532508-rckbg2ukr58g0a44cqqntrvsntsqa0f8.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });

  }

  logout(){
    sessionStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
        window.location.reload();
      });
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, this.headers)
    .pipe(
      map( (resp: any) => {

        const { rol, google, activo, nombre, apellido, email, img = '', uid, bio } = resp.usuario;
        this.usuario = new Usuario(nombre, apellido, email, '', google, activo, img, rol, bio, uid);

        this.guardarDatosUsuario(resp.token, resp.menu);

        return true;
      }),
      catchError( error => of(false))
    );
  }

  crearUsuario( formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
    .pipe(
      tap( (resp: any) => {
        this.guardarDatosUsuario(resp.token, resp.menu);
      })
    );
  }

  actualizarPerfil(data: PerfilForm){

    data = {
      ...data,
      rol: this.usuario.rol,
      email: this.usuario.email
    };

    return this.http.put(`${base_url}/usuarios/${ this.uid }`, data, this.headers);
  }

  login( formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap( (resp: any) => {
          this.guardarDatosUsuario(resp.token, resp.menu);
        })
      );
  }

  loginGoogle( token: string) {
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap( (resp: any) => {
          this.guardarDatosUsuario(resp.token, resp.menu);
        })
      );
  }

  cargarUsuarios(desde: number = 0, hasta: number = 6) {
    const url = `${ base_url }/usuarios?desde=${desde}&hasta=${hasta}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map( resp => {
          const usuarios = resp.usuarios.map(
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
              user.uid,
              user.estado
            )
          );

          return {
            total: resp.total,
            usuarios
          };
        })
      );
  }

  // eliminarUsuario( usuario: Usuario) {
  //   const url = `${ base_url }/usuarios/${usuario.uid}`;
  //   return this.http.delete(url, this.headers);
  // }

  aceptarTerminos( usuario: Usuario) {
    const url = `${ base_url }/usuarios/terminos/${usuario.uid}`;
    return this.http.put(url, usuario, this.headers);
  }

  eliminarUsuario( usuario: Usuario) {
    const url = `${ base_url }/usuarios/borrar/${usuario.uid}`;
    return this.http.put(url, usuario, this.headers);
  }

  habilitarUsuario( usuario: Usuario) {
    const url = `${ base_url }/usuarios/habilitar/${usuario.uid}`;
    return this.http.put(url, usuario, this.headers);
  }

  actualizarUsuario(usuario: Usuario){

    return this.http.put(`${base_url}/usuarios/${ usuario.uid }`, usuario, this.headers);
  }

  getUsuariosAdministrativos() {
    return this.http.get(`${base_url}/usuarios/rol/administrativos`)
      .pipe(
        map( (resp: any) => resp = resp.usuarios)
      );
  }

  getUsuario(uid: string){
    return this.http.get(`${base_url}/usuarios/${uid}`)
      .pipe(
        map( (resp: any) => resp = resp.usuario)
      );
  }

  getUsuariosChat(rol: string){
    return this.http.get(`${base_url}/usuarios/rol/usuario/${rol}`)
    .pipe(
      map( (resp: any) => resp = resp.usuarios)
    );
  }

  conectado(uid: string){
    return this.http.put(`${base_url}/login/activar/${uid}`, this.headers);
  }

  desconectado(uid: string){
    return this.http.put(`${base_url}/login/desactivar/${uid}`, this.headers);
  }

  sumarConexion(uid: string){
    return this.http.put(`${base_url}/login/sumar/${uid}`, this.headers);
  }

  restarConexion(uid: string){
    return this.http.put(`${base_url}/login/restar/${uid}`, this.headers);
  }

  recuperarPassword(email){
    return this.http.put(`${base_url}/login/recuperar/`, {email});
  }

  guardarDatosUsuario(token: string, menu: string) {
    sessionStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
}
