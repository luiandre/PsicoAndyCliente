import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';

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

  constructor(  public sidebarService: SidebarService,
                private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
    this.sidebarService.cargarMenu();
  }

  ngOnInit(): void {
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
