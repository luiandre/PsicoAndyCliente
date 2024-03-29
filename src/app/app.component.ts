import { Component, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './services/usuario.service';
import * as io from 'socket.io-client';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cliente';

  socket = io(socket_url);

  constructor( private usuarioService: UsuarioService){
    localStorage.removeItem('menu');
  }

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHander(event) {
  //   if (this.usuarioService.usuario){
  //     localStorage.clear();
  //     this.usuarioService.restarConexion(this.usuarioService.uid).subscribe( data => {
  //       this.usuarioService.logout();
  //     });
  //   }
  // }

  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //     this.socket.emit('guardar-usuarios', {});
  // }
}
