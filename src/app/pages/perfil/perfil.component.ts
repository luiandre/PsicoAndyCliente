import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Usuario } from 'src/app/models/usuario.model';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { ignoreElements } from 'rxjs/operators';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public usuario: Usuario;
  public perfilForm: FormGroup;
  public imagenNueva: File;
  public imgShow: any = null;

  constructor(  private usuarioService: UsuarioService,
                private fb: FormBuilder,
                private fileUploadSerivece: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      apellido: [this.usuario.apellido, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      bio: [this.usuario.bio, [Validators.minLength(5), Validators.maxLength(100)]],
      anterior: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      nueva: ['', [Validators.minLength(5), Validators.maxLength(100)]],
      repetir: ['', [Validators.minLength(5), Validators.maxLength(100)]],
    }, {
      validators: this.passwordsIguales('nueva', 'repetir')
    });
  }

  actualizarPerfil(){

    let data;

    if (this.perfilForm.value.anterior !== ''){
        data = {
          ...this.perfilForm.value
        };
    } else {
      data = {
        apellido: this.perfilForm.value.apellido,
        bio: this.perfilForm.value.bio,
        nombre: this.perfilForm.value.nombre,
      };
    }

    this.usuarioService.actualizarPerfil( data ).subscribe( resp => {

      const { nombre, apellido, bio} = this.perfilForm.value;

      this.usuario.nombre = nombre;
      this.usuario.apellido = apellido;
      this.usuario.bio = bio;

      Swal.fire({
        title: 'Exito!',
        text: 'Perfil actualizado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }, (err) => {
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }

  cambiarImagen( file: File){
    this.imagenNueva = file;

    if ( !file){
      this.imagenNueva = null;
      return this.imgShow = null;
    }

    if (!this.imagenNueva.type.includes('image')){
      Swal.fire({
        title: 'Error!',
        text: 'No ha subido una imagen',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.imagenNueva = null;
      return this.imgShow = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgShow = reader.result;
    };

  }

  passwordsIguales(pass1: string, pass2: string){
    return ( formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({noEsIgual: true});
      }
    };
  }

  subirImagen(){

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.fileUploadSerivece.actualizarFoto(this.imagenNueva, 'usuarios', this.usuario.uid).subscribe( (resp: any) => {
      this.usuario.img = resp.nombreArchivo;
      Swal.close();
      Swal.fire({
        title: 'Exito!',
        text: 'Foto actualizada',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }, err => {
      Swal.close();
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo subir la imagen',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }
}
