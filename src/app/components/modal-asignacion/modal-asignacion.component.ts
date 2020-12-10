import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalAsignacionService } from '../../services/modal-asignacion.service';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AsignacionService } from '../../services/asignacion.service';
import { Asignacion } from '../../models/asignacion.model';
import Swal from 'sweetalert2';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-modal-asignacion',
  templateUrl: './modal-asignacion.component.html',
  styles: [
  ]
})
export class ModalAsignacionComponent implements OnInit {

  public totalUsuarios = 0;
  public usuarios: Usuario[];
  public usuariosTemp: Usuario[];
  public desde = 0;
  public hasta = 4;
  public cargando = true;
  public socket = io(socket_url);

  constructor(  public modalAsignacionService: ModalAsignacionService,
                private usuarioService: UsuarioService,
                private busquedaService: BusquedasService,
                private asignacionService: AsignacionService) { }

  cerrarModal() {
    this.modalAsignacionService.cerrarModal();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.socket.on('nuevo-usuario', function(data) {
      this.cargarUsuarios();
    }.bind(this));
  }

  public cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuariosModal(this.desde).subscribe( ({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
      if (this.totalUsuarios < 4) {
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
    } else if (this.hasta - this.desde < 3){
      this.hasta = this.desde + 4;
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

  agregarProfesional(usuarioProf: Usuario){

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      customClass: {
        container: 'my-swal'
      },
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    const asignacion: Asignacion = {
      paciente: this.modalAsignacionService.id,
      profesional: usuarioProf.uid
    };

    this.asignacionService.crearAsignacion(asignacion).subscribe( resp => {

      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: usuarioProf.nombre + ' ' + usuarioProf.apellido + ' asignado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.socket.emit('guardar-asignacion', asignacion);
    }, err => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });

  }
}
