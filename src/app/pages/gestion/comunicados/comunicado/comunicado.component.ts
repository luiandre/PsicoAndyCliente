import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { UsuarioService } from 'src/app/services/usuario.service';

import * as io from 'socket.io-client';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { Comunicado } from '../../../../models/comunicado.model';
import { ComunicadoService } from '../../../../services/comunicado.service';


const socket_url = environment.socket_url;

@Component({
  selector: 'app-comunicado',
  templateUrl: './comunicado.component.html',
  styles: [
  ]
})
export class ComunicadoComponent implements OnInit {

  public comunicado: Comunicado;
  public comunicadoSeleccionado: Comunicado;

  public formSubmitted = false;

  public comunicadoForm: FormGroup;

  public socket = io(socket_url);


  constructor(  private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private comunicadoService: ComunicadoService,
                private router: Router,
                private usuarioService: UsuarioService) {

                }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarComunicado(id);
    });

    this.comunicadoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.min(6), Validators.maxLength(100)]],
      detalle: ['', [Validators.required, Validators.min(10), Validators.maxLength(500)]],
    });
  }

  cargarComunicado( id: string) {

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

    this.comunicadoService.getComunicado(id)
    .pipe(
      delay(1000)
    )
    .subscribe( comunicado => {

      Swal.close();

      if ( !comunicado ){
        return this.router.navigateByUrl('/dashboard/comunicados');
      }

      const { titulo, detalle} = comunicado;
      this.comunicadoSeleccionado = comunicado;
      this.comunicadoForm.setValue({titulo, detalle});

    }, (err) => {
      Swal.close();
      return this.router.navigateByUrl('/dashboard/comunicados');
    });
  }

  guardarComunicado() {
    this.formSubmitted = true;

    if (this.comunicadoForm.invalid) {
      return;
    }

    if (this.comunicadoSeleccionado){
      this.actualizarComunicado();
    } else {
      this.nuevoComunicado();
    }
  }

  nuevoComunicado() {
    const comunicado: Comunicado = {
      titulo: this.comunicadoForm.value.titulo,
      detalle: this.comunicadoForm.value.detalle,
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

    this.comunicadoService.crearComunicado(comunicado).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Comunicado guardado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.socket.emit('guardar-comunicado', resp);
      this.router.navigateByUrl('/dashboard/comunicados');
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

  actualizarComunicado(){
    const comunicado: Comunicado = {
      titulo: this.comunicadoForm.value.titulo,
      detalle: this.comunicadoForm.value.detalle,
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

    this.comunicadoService.actualizarComunicado(this.comunicadoSeleccionado.id, comunicado).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Comunicado actualizado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.socket.emit('guardar-comunicados', resp);
      this.router.navigateByUrl('/dashboard/comunicados');
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
    if (this.comunicadoForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }


}
