import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';
import * as io from 'socket.io-client';

import { Noticia } from '../../../../models/noticia.model';
import { NoticiasService } from '../../../../services/noticia.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { environment } from 'src/environments/environment';


const socket_url = environment.socket_url;

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styles: [
  ]
})
export class NoticiaComponent implements OnInit {

  public noticia: Noticia;
  public noticiaSeleccionada: Noticia;

  public formSubmitted = false;

  public noticiaForm: FormGroup;

  public socket = io(socket_url);


  constructor(  private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private noticiasService: NoticiasService,
                private router: Router,
                private usuarioService: UsuarioService) {

                }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarNoticia(id);
    });

    this.noticiaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.min(6), Validators.maxLength(50)]],
      detalle: ['', [Validators.required, Validators.min(10), Validators.maxLength(100)]],
    });
  }

  cargarNoticia( id: string) {

    if ( id === 'nuevo'){
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.noticiasService.getNoticia(id)
    .pipe(
      delay(1000)
    )
    .subscribe( noticia => {

      Swal.close();

      if ( !noticia ){
        return this.router.navigateByUrl('/dashboard/noticias');
      }

      const { titulo, detalle} = noticia;
      this.noticiaSeleccionada = noticia;
      this.noticiaForm.setValue({titulo, detalle});

    }, (err) => {
      Swal.close();
      return this.router.navigateByUrl('/dashboard/noticias');
    });
  }

  guardarNoticia() {
    this.formSubmitted = true;

    if (this.noticiaForm.invalid) {
      return;
    }

    if (this.noticiaSeleccionada){
      this.actualizarNoticia();
    } else {
      this.nuevaNoticia();
    }
  }

  nuevaNoticia() {
    const noticia: Noticia = {
      titulo: this.noticiaForm.value.titulo,
      detalle: this.noticiaForm.value.detalle,
      fecha: new Date().getTime(),
      usuario: this.usuarioService.uid,
      img: 'no-image'
    };

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.noticiasService.crearNoticia(noticia).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Noticia guardada',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.socket.emit('guardar-noticia', resp);
      this.router.navigateByUrl('/dashboard/noticias');
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

  actualizarNoticia(){
    const noticia: Noticia = {
      titulo: this.noticiaForm.value.titulo,
      detalle: this.noticiaForm.value.detalle,
      fecha: new Date().getTime(),
      usuario: this.usuarioService.uid,
    };

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.noticiasService.actualizarNoticia(this.noticiaSeleccionada.id, noticia).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Noticia actualizada',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.socket.emit('guardar-noticia', resp);
      this.router.navigateByUrl('/dashboard/noticias');
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


  campoNoValido(campo: string): boolean{
    if (this.noticiaForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }


}
