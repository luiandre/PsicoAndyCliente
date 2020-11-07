import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ProfGuard implements CanActivate {
  constructor(  private usuarioService: UsuarioService,
                private router: Router){}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean {

      if ( this.usuarioService.rol === 'PROF_ROL' || this.usuarioService.rol === 'ADMIN_ROL' ) {
        return true;
      } else {
        this.router.navigateByUrl('/inicio');
        return false;
      }
    }
}
