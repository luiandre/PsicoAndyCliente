import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { ServiciosService } from '../../../services/servicios.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Servicio } from '../../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styles: [
  ]
})
export class ServiciosComponent implements OnInit, OnDestroy {

  public totalServicios = 0;
  public servicios: any[];
  public serviciosTemp: Servicio[];
  public desde = 0;
  public hasta = 0;
  public cargando = true;
  private imgSubs: Subscription;

  constructor(  private busquedaService: BusquedasService,
                private modalImagenService: ModalImagenService,
                private servicioService: ServiciosService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarServicios();

    this.imgSubs = this.modalImagenService.imgActualizada
      .pipe(
        delay(100)
      ).subscribe( img => this.cargarServicios());
  }

  public cargarServicios() {
    this.cargando = true;
    this.servicioService.cargarServicios(this.desde).subscribe( ({total, servicios}) => {
      this.totalServicios = total;
      this.servicios = servicios;
      this.serviciosTemp = servicios;
      this.cargando = false;
      if (this.totalServicios < 6) {
        this.hasta = this.totalServicios;
      }
    });
  }

  buscarServicio(termino: string) {

    if (termino.length === 0){
      return this.servicios = this.serviciosTemp;
    }

    this.busquedaService.buscar('servicios', termino).subscribe( respusta => {
      this.servicios = respusta;
      this.totalServicios = respusta.length;
    });
  }

  abrirModal(servicio: Servicio){
    this.modalImagenService.abrirModal('servicios', servicio.id, servicio.img);
  }

  eliminarNoticia( servicio: Servicio){

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Eliminar servicio ' + servicio.titulo,
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

        this.servicioService.eliminarServicio(servicio.id).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Exito!',
            'Noticia ' + servicio.titulo + ' eliminada.',
            'success'
          );
          this.cargarServicios();
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

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalServicios) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalServicios){
      this.hasta = this.totalServicios;
    } else if (this.hasta < this.totalServicios){
      this.hasta = 6;
    }

    this.cargarServicios();
  }

}
