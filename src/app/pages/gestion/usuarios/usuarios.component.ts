import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';
import * as io from 'socket.io-client';

import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios = 0;
  public usuarios: Usuario[];
  public usuariosTemp: Usuario[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  public imgSubs: Subscription;
  public socket = io(socket_url);

  constructor(  private usuarioService: UsuarioService,
                private busquedaService: BusquedasService,
                private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.imgActualizada
    .pipe(
      delay(100)
    )
    .subscribe( img => {
      this.cargarUsuarios();
    });

    this.socket.on('nuevo-usuario', function(data) {
      this.cargarUsuarios();
    }.bind(this));
  }

  public cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe( ({total, usuarios}) => {
      this.totalUsuarios = total;
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
    } else if (this.hasta - this.desde < 5){
      this.hasta = this.desde + 6;
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

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire({
        title: 'Error!',
        text: 'No puede inhabilitarse ' + usuario.nombre + ' ' + usuario.apellido,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Inhabilitar usuario ' + usuario.nombre + ' ' + usuario.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon: 'warning',
          title: 'Espere por favor...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading();
          },
        });

        this.usuarioService.eliminarUsuario(usuario).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Inhabilitado!',
            'Usuario ' + usuario.nombre + ' ' + usuario.apellido + ' inhabilitado.',
            'success'
          );

          this.socket.emit('eliminar-usuarios', usuario);

          this.cargarUsuarios();
        }, (err) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: err.error.msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    });
  }

  habilitarUsuario(usuario: Usuario) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire({
        title: 'Error!',
        text: 'No puede habilitarse ' + usuario.nombre + ' ' + usuario.apellido,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Habilitar usuario ' + usuario.nombre + ' ' + usuario.apellido,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon: 'warning',
          title: 'Espere por favor...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading();
          },
        });

        this.usuarioService.habilitarUsuario(usuario).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Habilitado!',
            'Usuario ' + usuario.nombre + ' ' + usuario.apellido + ' habilitado.',
            'success'
          );

          this.cargarUsuarios();
        }, (err) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: err.error.msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }
    });
  }

  cambiarRol(usuario: Usuario){

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire({
        title: 'Error!',
        text: 'No puede cambiar su rol: ' + usuario.nombre + ' ' + usuario.apellido,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.usuarioService.actualizarUsuario(usuario).subscribe( resp => {
      Swal.close();
      Swal.fire(
        'Exito!',
        usuario.nombre + ' ' + usuario.apellido + ' ha cambiado de rol ',
        'success'
      );
    }, (err) => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
