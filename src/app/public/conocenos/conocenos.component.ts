import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.component.html',
  styles: [
  ]
})
export class ConocenosComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public cargando = true;

  constructor(  private usuarioService: UsuarioService,
                private router: Router) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.getUsuariosAdministrativos().subscribe( usuarios => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  contactar(uid: string){
    this.router.navigateByUrl(`/mensajes/${uid}`);
  }

}
