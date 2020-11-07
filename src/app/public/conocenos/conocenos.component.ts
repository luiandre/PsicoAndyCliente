import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-conocenos',
  templateUrl: './conocenos.component.html',
  styles: [
  ]
})
export class ConocenosComponent implements OnInit {

  public usuarios: Usuario[] = [];

  constructor(  private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.usuarioService.getUsuariosAdministrativos().subscribe( usuarios => {
      this.usuarios = usuarios;
    });
  }

}
