import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

import * as io from 'socket.io-client';

import { UsuarioService } from '../../services/usuario.service';
import { MensajeService } from '../../services/mensajes.service';
import { Usuario } from '../../models/usuario.model';
import { Mensaje } from '../../models/mensaje.model';
import { BusquedasService } from '../../services/busquedas.service';
import { Router } from '@angular/router';
import { SalasService } from '../../services/salas.service';
import { Sala } from '../../models/sala.model';
import Swal from 'sweetalert2';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css'],
})
export class MensajesComponent implements OnInit {

  public usuarios: any[];
  public mensajes: Mensaje[] = [];
  public socket = io(socket_url);
  public cargando = true;
  public totalUsuarios = 0;
  private contador = 0;

  constructor(  public usuarioService: UsuarioService,
                private mensajesService: MensajeService,
                public busquedasService: BusquedasService,
                private router: Router,
                private salasService: SalasService) {}

  ngOnInit() {

    this.obtenerUsuarios();

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
          this.obtenerUsuarios();
        }

      }.bind(this));

    this.socket.on('nuevo-usuarios', function(data) {
      this.obtenerUsuarios();
    }.bind(this));
  }

  obtenerUsuarios(){

    this.usuarioService.getUsuariosChat(this.usuarioService.rol).subscribe((usuarios: Usuario[]) => {
      const usuariosTemp = [];
      this.totalUsuarios = usuarios.length;
      this.cargando = false;
      usuarios.forEach((usuario: Usuario) => {
        this.mensajesService.getUltimoRecibido(usuario.uid).subscribe(mensaje => {

          let data;

          if (mensaje.length !== 0){
            data = {
              uid: usuario.uid,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              rol: usuario.rol,
              img: usuario.img,
              estado: usuario.estado,
              fecha: mensaje[0].fecha,
              id: mensaje[0].id,
              mensaje: mensaje[0].mensaje,
              pendiente: mensaje[0].pendiente
            };
          } else {
            data = {
              uid: usuario.uid,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              rol: usuario.rol,
              img: usuario.img,
              estado: usuario.estado,
              fecha: 0,
              id: null,
              mensaje: null,
              pendiente: false
            };
          }

          usuariosTemp.push(data);
        });
      });
      this.usuarios = usuariosTemp;
    });
  }

  buscarUsuario(termino: string) {

    if (termino.length === 0){
      this.obtenerUsuarios();
      return;
    }

    this.busquedasService.buscarUsuariosBusquedaRol(termino, this.usuarioService.rol).subscribe( (usuarios: Usuario[]) => {
      const usuariosTemp = [];
      this.totalUsuarios = usuarios.length;
      usuarios.forEach((usuario: Usuario) => {
        this.mensajesService.getUltimoRecibido(usuario.uid).subscribe( (mensaje) => {

          let data;

          if (mensaje.length !== 0){
            data = {
              ...usuario,
              fecha: mensaje[0].fecha,
              id: mensaje[0].id,
              mensaje: mensaje[0].mensaje,
              pendiente: mensaje[0].pendiente
            };
          } else {
            data = {
              ...usuario,
              fecha: 0,
              id: null,
              mensaje: null,
              pendiente: false
            };
          }
          usuariosTemp.push(data);
        });
      });
      this.usuarios = usuariosTemp;

    });
  }

  detalle(uid: string, id: string, pendiente: boolean){
    this.router.navigateByUrl(`/mensajes/${uid}`);

    if (pendiente === true){
      this.mensajesService.desactivarPendiente(id).subscribe();
      this.usuarioService.pendiente = false;
    }
  }

  llamar(uid: string){

    this.salasService.getSalas().subscribe( (resp: any[]) => {
      this.contador = 0;
      resp.forEach( sala => {
        if ( uid === sala.origen || uid === sala.destino){
          this.contador = this.contador + 1;
        }
      });

      if (this.contador > 0){
        Swal.fire({
          icon: 'error',
          title: 'Lo siento',
          text: 'El usuario esta en otra llamada',
        });
      } else {
        this.salasService.crearSala(uid).subscribe(async (sala: Sala) => {
          this.socket.emit('guardar-llamada', sala);
          let url = window.location.href;
          const path = `/video/${sala.uuid}`;
          url = url.replace('/mensajes', path);
          window.open(url, '_blank');
        });
      }
      });
  }
}

