import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';

const socket_url = environment.socket_url;

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  socket = io(socket_url);
  
  constructor(  private usuarioService: UsuarioService,
                private router: Router){}
  canLoad(route: Route, segments: import('@angular/router').UrlSegment[]): boolean | import('rxjs').Observable<boolean> | Promise<boolean> {
    return this.usuarioService.validarToken().pipe(
      tap( isAuth => {
        if (!isAuth){
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    return this.usuarioService.validarToken().pipe(
      tap( isAuth => {
        if (!isAuth){
          this.logout();
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

  logout(){

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.usuarioService.restarConexion(this.usuarioService.uid).subscribe( () => {
      this.usuarioService.desconectado(this.usuarioService.uid).subscribe( data => {
        this.socket.emit('guardar-usuarios', data);
        Swal.close();
        this.usuarioService.logout();
      });
    });

  }

}
