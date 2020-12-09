import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Asignacion } from '../../../../models/asignacion.model';
import { AsignacionService } from '../../../../services/asignacion.service';
import { ActivatedRoute } from '@angular/router';
import { ModalAsignacionComponent } from '../../../../components/modal-asignacion/modal-asignacion.component';
import { ModalAsignacionService } from '../../../../services/modal-asignacion.service';


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
  }

  public cargarAsignaciones(uid: string) {
    this.cargando = true;
    this.asignacionService.cargarAsignaciones(uid, this.desde).subscribe( ({total, asignaciones}) => {
      this.totalAsignaciones = asignaciones.length;
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
    } else if (this.hasta < this.totalAsignaciones){
      this.hasta = 6;
    }

    this.cargarAsignaciones(this.uid);
  }

  eliminarAsignacion( asignacion: Asignacion){

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Eliminar asignacion ',
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
            'Asignació eliminada.',
            'success'
          );
          this.cargarAsignaciones(this.uid);
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
