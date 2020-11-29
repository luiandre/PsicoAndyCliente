import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';
import { ComunicadoService } from '../../services/comunicado.service';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;
  socket = io(socket_url);
  public totalComunicados = 0;

  constructor(  public sidebarService: SidebarService,
                private usuarioService: UsuarioService,
                private comunicadoService: ComunicadoService) {
    this.usuario = usuarioService.usuario;
    this.sidebarService.cargarMenu();
  }

  ngOnInit(): void {

    this.socket.on('nuevo-comunicado', function(data) {
      this.cargarComunicados();
    }.bind(this));

    this.cargarComunicados();
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

  cargarComunicados(){
    this.comunicadoService.cargarComunicados().subscribe(({total, comunicado}) => {
      this.totalComunicados = total;
    });
  }
}
