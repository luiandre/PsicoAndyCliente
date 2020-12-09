import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { environment } from 'src/environments/environment';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styles: [
  ]
})
export class AsignacionesComponent implements OnInit {

  public totalUsuarios = 0;
  public usuarios: Usuario[];
  public usuariosTemp: Usuario[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  public socket = io(socket_url);

  constructor(  private usuarioService: UsuarioService,
                private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.socket.on('nuevo-usuario', function(data) {
      this.cargarUsuarios();
    }.bind(this));
  }

  public cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuariosAsignacion(this.desde).subscribe( ({total, usuarios}) => {
      this.totalUsuarios = usuarios.length;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
      if (this.totalUsuarios < 6) {
        this.hasta = this.totalUsuarios;
      }
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalUsuarios){
      this.hasta = this.totalUsuarios;
    } else if (this.hasta < this.totalUsuarios){
      this.hasta = 6;
    }

    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {

    if (termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios', termino).subscribe( (respusta: Usuario[]) => {
      this.usuarios = respusta;
      this.totalUsuarios = respusta.length;
    });
  }

}
