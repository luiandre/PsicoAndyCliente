import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { Comunicado } from '../../models/comunicado.model';
import { ComunicadoService } from '../../services/comunicado.service';
import { UsuarioService } from '../../services/usuario.service';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public comunicados: Comunicado[] = [];
  public socket = io(socket_url);
  public cargando = true;

  constructor(  private comunicadoService: ComunicadoService,
                private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarComunicados();

    this.socket.on('nuevo-comunicado', function(data) {
      this.cargarComunicados();
    }.bind(this));
  }

  cargarComunicados(){

    if (this.usuarioService.rol !== 'USER_ROL' && this.usuarioService.uid){
      this.cargando = true;
      this.comunicados = [];
      this.comunicadoService.cargarComunicados().subscribe(resp => {
        this.comunicados = resp.comunicado;
        this.cargando = false;
    });
    }
  }

}
