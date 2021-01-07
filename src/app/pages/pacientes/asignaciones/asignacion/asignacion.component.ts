import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';

import Swal from 'sweetalert2';
import { Asignacion } from '../../../../models/asignacion.model';
import { AsignacionService } from '../../../../services/asignacion.service';
import { ActivatedRoute } from '@angular/router';
import { ModalAsignacionService } from '../../../../services/modal-asignacion.service';
import { environment } from 'src/environments/environment';


const socket_url = environment.socket_url;

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styles: [
  ]
})
export class AsignacionComponent implements OnInit {

  public totalAsignaciones = 0;
  public asignaciones: any[];
  public asignacionesTemp: Asignacion[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  public socket = io(socket_url);
  public uid;

  constructor(  private asignacionService: AsignacionService,
                private activatedRoute: ActivatedRoute,
                private modalAsignacionService: ModalAsignacionService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({uid}) => {
      this.uid = uid;
      this.cargarAsignaciones(uid);
    });

    this.socket.on('nuevo-asignacion', function(data) {
      if (data.paciente === this.uid){
        this.cargarAsignaciones(this.uid);
      }
    }.bind(this));
  }

  public cargarAsignaciones(uid: string) {
    this.cargando = true;
    this.asignacionService.cargarAsignaciones(uid, this.desde).subscribe( ({total, asignaciones}) => {
      this.totalAsignaciones = total;
      this.asignaciones = asignaciones;
      this.asignaciones = asignaciones;
      this.cargando = false;
      if (this.totalAsignaciones < 6) {
        this.hasta = this.totalAsignaciones;
      }
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalAsignaciones) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalAsignaciones){
      this.hasta = this.totalAsignaciones;
    } else if (this.hasta - this.desde < 5){
      this.hasta = this.desde + 6;
    }

    this.cargarAsignaciones(this.uid);
  }

  eliminarAsignacion( asignacion){

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Eliminar asignación de ' + asignacion.profesional.nombre + ' ' + asignacion.profesional.apellido,
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

        this.asignacionService.eliminarAsignacion(asignacion.id).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Exito!',
            'Asignación eliminada.',
            'success'
          );
          this.cargarAsignaciones(this.uid);
          this.socket.emit('guardar-asignacion', asignacion);
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

  abrirModal(){
    this.modalAsignacionService.abrirModal(this.uid);
  }

}
