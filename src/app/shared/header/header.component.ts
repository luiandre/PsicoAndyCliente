import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { Mensaje } from '../../models/mensaje.model';
import Swal from 'sweetalert2';
import { MensajeService } from '../../services/mensajes.service';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

declare function customSidebar();
const socket_url = environment.socket_url;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;
  socket = io(socket_url);
  public pendiente = false;

  constructor(  private usuarioService: UsuarioService,
                private router: Router,
                private mensajeService: MensajeService) {
      this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    customSidebar();

    this.cargarPendiente();

    this.socket.on('nuevo-mensaje', function(data: Mensaje){
      const mensajeRecibido: Mensaje = {
        de: { _id: data.de },
        para: { _id: data.para },
        fecha: data.fecha,
        mensaje: data.mensaje,
        id: data.id,
        pendiente: data.pendiente
      };

      if (mensajeRecibido.para._id === this.usuarioService.uid){
        this.pendiente = true;

        this.usuarioService.getUsuario(mensajeRecibido.de._id).subscribe( (usuario: Usuario) => {
          Swal.fire({
            position: 'bottom-end',
            customClass: {
              popup: 'swal-height',
            },
            text: usuario.nombre + ' ' + usuario.apellido,
            footer: mensajeRecibido.mensaje,
            showConfirmButton: false,
            timer: 2500,
            width: 300
          });
        });

        const player: any = document.getElementById('player');
        player.load();
        const playPromise = player.play();

        if (playPromise){
          playPromise.then( () => {
            setTimeout(() => {
            }, player.duration);
          }).catch( e => {

          });
        }
      }

    }.bind(this));

    this.socket.on('nuevo-llamada', function(data){

      if (data.destino === this.usuarioService.uid){


        this.usuarioService.getUsuario(data.origen).subscribe( (usuario: Usuario) => {
          Swal.fire({
            title: 'Tienes una videollamada entrante',
            text: 'De: ' + usuario.nombre + ' ' + usuario.apellido,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
             this.router.navigateByUrl(`/video/${data.uuid}`);
            } else {
              this.socket.emit('llamada-rechazada', data);
            }
          });
        });

        const player: any = document.getElementById('call');
        player.load();
        const playPromise = player.play();

        if (playPromise){
          playPromise.then( () => {
            setTimeout(() => {
            }, player.duration);
          }).catch( e => {

          });
        }
      }

    }.bind(this));

    this.socket.on('nuevo-eliminado', function(data){

      if (data.uid === this.usuarioService.uid){
        this.logout();
      }

    }.bind(this));

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

  cambiarEstado(){
    if (this.pendiente){
      this.pendiente = false;
    }
  }

  buscar(termino: string){

    if (termino.length === 0){
      return;
    }
    this.router.navigateByUrl(`/buscar/${termino}`);
  }

  cargarPendiente(){
    if (this.usuarioService.usuario){
      this.usuarioService.getUsuariosChat(this.usuarioService.rol).subscribe((usuarios: Usuario[]) => {
        usuarios.forEach((usuario: Usuario) => {
          this.mensajeService.getUltimoRecibido(usuario.uid).subscribe(mensaje => {
            if (mensaje.length !== 0){
                if (mensaje[0].pendiente){
                  this.pendiente = true;
                  return;
                }
            }
          });
        });
      });
    }
  }
}
