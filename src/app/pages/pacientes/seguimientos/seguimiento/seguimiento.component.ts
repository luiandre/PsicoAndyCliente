import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Seguimiento } from '../../../../models/seguimiento.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguimientoService } from '../../../../services/seguimiento.service';
import { delay } from 'rxjs/operators';
import {Location} from '@angular/common';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styles: [
  ]
})
export class SeguimientoComponent implements OnInit {

  public id;
  public seguimiento: Seguimiento;
  public formSubmitted = false;

  public seguimientoForm: FormGroup;

  constructor(  private activatedRoute: ActivatedRoute,
                private fb: FormBuilder,
                private seguimientoService: SeguimientoService,
                private router: Router,
                private location: Location) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.cargarSeguimiento(id);
    });

    this.seguimientoForm = this.fb.group({
      numero: ['', [Validators.required, Validators.min(1), Validators.maxLength(3)]],
      fecha: ['', [Validators.required, Validators.min(10), Validators.maxLength(10)]],
      actividad: ['', [Validators.required, Validators.min(3), Validators.maxLength(500)]],
      observaciones: ['', [Validators.required, Validators.min(3), Validators.maxLength(500)]],
    });
  }

  cargarSeguimiento(id: string){
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

    this.seguimientoService.getSeguimiento(id)
    .pipe(
      delay(1000)
    )
    .subscribe( seguimiento => {

      Swal.close();

      if ( !seguimiento ){
        this.location.back();
      }
      this.seguimiento = seguimiento;
      this.seguimientoForm.setValue({
        numero: seguimiento.numero,
        fecha: seguimiento.fecha,
        actividad: seguimiento.actividad,
        observaciones: seguimiento.observaciones
      });

    }, (err) => {
      Swal.close();
      this.location.back();
    });
  }

  guardarSeguimiento() {
    this.formSubmitted = true;

    if (this.seguimientoForm.invalid) {
      return;
    }

    if (this.seguimiento){
      this.actualizarSeguimiento();
    } else {
      this.nuevoSeguimiento();
    }
  }

  nuevoSeguimiento() {
    const seguimiento: Seguimiento = {
      paciente: this.seguimientoService.id,
      ...this.seguimientoForm.value
    };

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.seguimientoService.crearSeguimiento(seguimiento).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Seguimiento guardada',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.location.back();
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

  actualizarSeguimiento(){
    const seguimiento: Seguimiento = {
      fechaActualizacion: new Date().getTime(),
      ...this.seguimientoForm.value
    };

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.seguimientoService.actualizarSeguimiento(this.id, seguimiento).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Seguimiento actualizado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.location.back();
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

  cancelar(){
    this.location.back();
  }

  campoNoValido(campo: string): boolean{

    if (this.seguimientoForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

}
