import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {

  public auth2: any;
  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
  });

  constructor(  private fb: FormBuilder,
                public usuarioService: UsuarioService,
                public router: Router) { }

  ngOnInit(): void {
  }

  campoNoValido(campo: string): boolean{
    if (this.loginForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

  login() {

    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.usuarioService.recuperarPassword(this.loginForm.get('email').value).subscribe(resp => {
      Swal.fire({
        title: 'Exito!',
        text: 'Por favor, revise su correo ' + this.loginForm.get('email').value,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.router.navigateByUrl('/login');
    }, err => {
      Swal.fire({
        title: 'Error!',
        text: err.error.msg,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });

  }

}
