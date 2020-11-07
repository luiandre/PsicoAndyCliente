import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  public formSubmitted = false;
  socket = io(socket_url);

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.min(6), Validators.maxLength(50)]],
    confPassword: ['', [Validators.required, Validators.min(6), Validators.maxLength(50)]],
    terminos: [ false, [Validators.requiredTrue]]
  }, {
    validators: this.passwordsIguales('password', 'confPassword')
  });

  constructor(  private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private router: Router) { }

  crearUsuario() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    // Realiza el posteo
    this.usuarioService.crearUsuario( this.registerForm.value).subscribe( resp => {
      this.usuarioService.sumarConexion(resp.usuario.uid).subscribe( () => {
        this.socket.emit('guardar-usuarios', resp);
        this.router.navigateByUrl('/dashboard');
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

  campoNoValido(campo: string): boolean{

    if (this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordNoValido(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('confPassword').value;

    if ((pass1 !== pass2) && this.formSubmitted){
      return true;
    } else {
      return false;
    }
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


}
