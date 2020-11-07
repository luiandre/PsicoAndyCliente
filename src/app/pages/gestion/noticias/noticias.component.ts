import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { NoticiasService } from '../../../services/noticia.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Noticia } from 'src/app/models/noticia.model';

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
  public cargando = true;
  private imgSubs: Subscription;

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
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalNoticias) {
      this.desde -= valor;
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
        this.noticiaService.eliminarNoticia(noticia.id).subscribe( resp => {
          Swal.fire(
            'Exito!',
            'Noticia ' + noticia.titulo + ' eliminada.',
            'success'
          );
          this.cargarNoticias();
        }, (err) => {
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
