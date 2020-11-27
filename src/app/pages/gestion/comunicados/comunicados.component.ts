import { Component, OnInit } from '@angular/core';
import { Comunicado } from '../../../models/comunicado.model';

import * as io from 'socket.io-client';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { ComunicadoService } from '../../../services/comunicado.service';
import { BusquedasService } from 'src/app/services/busquedas.service';


const socket_url = environment.socket_url;

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styles: [
  ]
})
export class ComunicadosComponent implements OnInit {

  public totalComunicados = 0;
  public comunicados: any[];
  public comunicadosTemp: Comunicado[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  public socket = io(socket_url);

  constructor(  private comunicadoService: ComunicadoService,
                private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarComunicados();
  }

  public cargarComunicados() {
    this.cargando = true;
    this.comunicadoService.cargarComunicados(this.desde).subscribe( ({total, comunicado}) => {
      this.totalComunicados = total;
      this.comunicados = comunicado;
      this.comunicadosTemp = comunicado;
      this.cargando = false;
      if (this.totalComunicados < 6) {
        this.hasta = this.totalComunicados;
      }
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalComunicados) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalComunicados){
      this.hasta = this.totalComunicados;
    } else if (this.hasta < this.totalComunicados){
      this.hasta = 6;
    }

    this.cargarComunicados();
  }

  buscarComunicado(termino: string) {

    if (termino.length === 0){
      return this.comunicados = this.comunicadosTemp;
    }

    this.busquedaService.buscar('comunicados', termino).subscribe( respusta => {
      this.comunicados = respusta;
      this.totalComunicados = respusta.length;
    });
  }

  eliminarComunicado( comunicado: Comunicado){

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Eliminar comunicado ' + comunicado.titulo,
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

        this.comunicadoService.eliminarComunicado(comunicado.id).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Exito!',
            'Comunicado ' + comunicado.titulo + ' eliminado.',
            'success'
          );
          this.socket.emit('guardar-comunicado', resp);
          this.cargarComunicados();
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

}
