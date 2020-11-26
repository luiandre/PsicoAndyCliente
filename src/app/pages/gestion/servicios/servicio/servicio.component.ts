import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../../../models/servicio.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { ServiciosService } from '../../../../services/servicios.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../../../models/usuario.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styles: [
  ]
})
export class ServicioComponent implements OnInit {

  public servicio: Servicio;
  public usuarios: Usuario[] = [];
  public usuarioSeleccionado: Usuario;
  public servicioSeleccionado: Servicio;

  public formSubmitted = false;

  public servicioForm: FormGroup;

  constructor(  private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private servicioService: ServiciosService,
                private router: Router,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarServicio(id);
    });

    this.servicioForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.min(6), Validators.maxLength(100)]],
      detalle: ['', [Validators.required, Validators.min(10), Validators.maxLength(500)]],
      responsable: ['', [Validators.required]],
    });

    this.cargarUsuarios();

    this.servicioForm.get('responsable').valueChanges.subscribe( usuarioId => {
      this.usuarioSeleccionado = this.usuarios.find( usuario => usuario.uid === usuarioId);
    });
  }

  cargarServicio( id: string) {

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

    this.servicioService.getServicio(id)
    .pipe(
      delay(1000)
    )
    .subscribe( servicio => {
      Swal.close();

      if ( !servicio ){
        return this.router.navigateByUrl('/dashboard/servicios');
      }

      const { titulo, detalle, responsable: { _id }} = servicio;
      this.servicioSeleccionado = servicio;
      this.servicioForm.setValue({titulo, detalle, responsable: _id});

    }, (err) => {
      Swal.close();
      return this.router.navigateByUrl('/dashboard/servicios');
    });
  }

  guardarServicio() {
    this.formSubmitted = true;

    if (this.servicioForm.invalid) {
      return;
    }

    if (this.servicioSeleccionado){
      this.actualizarServicio();
    } else {
      this.nuevoServicio();
    }
  }

  nuevoServicio() {
    const servicio: Servicio = {
      titulo: this.servicioForm.value.titulo,
      detalle: this.servicioForm.value.detalle,
      fecha: new Date().getTime(),
      usuario: this.usuarioService.uid,
      responsable: this.servicioForm.value.responsable,
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

    this.servicioService.crearServicio(servicio).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Servicio guardado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigateByUrl('/dashboard/servicios');
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

  actualizarServicio(){
    const servicio: Servicio = {
      titulo: this.servicioForm.value.titulo,
      detalle: this.servicioForm.value.detalle,
      fecha: new Date().getTime(),
      usuario: this.usuarioService.uid,
      responsable: this.servicioForm.value.responsable,
    };

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.servicioService.actualizarServicio(this.servicioSeleccionado.id, servicio).subscribe( resp => {
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Servicio actualizado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigateByUrl('/dashboard/servicios');
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
    if (this.servicioForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  cargarUsuarios(){
    this.usuarioService.getUsuariosAdministrativos().subscribe( usuarios => {
        this.usuarios = usuarios;
    });
  }

}
