import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';
import * as io from 'socket.io-client';

import { NoticiasService } from '../../../services/noticia.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Noticia } from 'src/app/models/noticia.model';
import { environment } from 'src/environments/environment';


const socket_url = environment.socket_url;

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styles: [
  ]
})

export class NoticiasComponent implements OnInit, OnDestroy {

  public totalNoticias = 0;
  public noticias: any[];
  public noticiasTemp: Noticia[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  private imgSubs: Subscription;
  public socket = io(socket_url);

  constructor(  private noticiaService: NoticiasService,
                private modalImagenService: ModalImagenService,
                private busquedaService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarNoticias();

    this.imgSubs = this.modalImagenService.imgActualizada
      .pipe(
        delay(100)
      ).subscribe( img => this.cargarNoticias());
  }

  public cargarNoticias() {
    this.cargando = true;
    this.noticiaService.cargarNoticias(this.desde).subscribe( ({total, noticias}) => {
      this.totalNoticias = total;
      this.noticias = noticias;
      this.noticiasTemp = noticias;
      this.cargando = false;
      if (this.totalNoticias < 6) {
        this.hasta = this.totalNoticias;
      }
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalNoticias) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalNoticias){
      this.hasta = this.totalNoticias;
    } else if (this.hasta - this.desde < 5){
      this.hasta = this.desde + 6;
    }

    this.cargarNoticias();
  }

  buscarNoticia(termino: string) {

    if (termino.length === 0){
      return this.noticias = this.noticiasTemp;
    }

    this.busquedaService.buscar('noticias', termino).subscribe( respusta => {
      this.noticias = respusta;
      this.totalNoticias = respusta.length;
    });
  }

  eliminarNoticia( noticia: Noticia){

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Eliminar noticia ' + noticia.titulo,
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

        this.noticiaService.eliminarNoticia(noticia.id).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Exito!',
            'Noticia ' + noticia.titulo + ' eliminada.',
            'success'
          );
          this.socket.emit('guardar-noticia', resp);
          this.cargarNoticias();
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

  abrirModal(noticia: Noticia){
    this.modalImagenService.abrirModal('noticias', noticia.id, noticia.img);
  }
}
