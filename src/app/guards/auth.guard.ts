import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

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
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

}
