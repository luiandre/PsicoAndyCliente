import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/models/usuario.model';

declare const gapi: any;
const socket_url = environment.socket_url;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public auth2: any;
  public formSubmitted = false;
  socket = io(socket_url);
  linkTerminos = `${socket_url}terminos-condiciones`;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.maxLength(50)]],
    recordarme: [localStorage.getItem('email')]
  });

  constructor(  private router: Router,
                private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private ngZone: NgZone) {}

  ngOnInit(): void {
    this.renderButton();
  }

  login() {

    this.formSubmitted = true;

    if (this.loginForm.invalid) {
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

    this.usuarioService.login(this.loginForm.value).subscribe( resp => {

      if (this.loginForm.get('recordarme').value){
        localStorage.setItem('email', this.loginForm.get('email').value);
      } else {
        localStorage.removeItem('email');
      }

      this.usuarioService.conectado(resp.usuario.uid).subscribe( () => {
        this.usuarioService.sumarConexion(resp.usuario.uid).subscribe(() => {
          this.usuarioService.cargarUsuarios().subscribe( data => {
            this.socket.emit('guardar-usuarios', data.usuarios);
            this.router.navigateByUrl('/dashboard');
            Swal.close();
          });
        });
      });
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

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 50,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });

    this.startApp();

  }

  aceptarTerminosGoolge(usuario: Usuario){
    if (!usuario.terminos){
      Swal.fire({
        title: 'Al ingresar con tu cuenta Google',
        icon: 'warning',
        html:
          `Aceptas los siguientes <a target="_blank" href="${this.linkTerminos}">Términos y condiciones</a>`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
        'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        cancelButtonText:
          'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.aceptarTerminos(usuario).subscribe( resp => {
            Swal.fire('Gracias por aceptar', '', 'success');
          });
        } else if (result.isDismissed) {
          Swal.fire({
            icon: 'error',
            title: 'Lo siento',
            text: 'No has aceptado los términos y condiciones'
          }).then((resultShow) => {
            if (resultShow.isConfirmed) {
              this.logout();
            }
          });
        }
      });
    }
  }

  logout(){

    Swal.fire({
      icon: 'warning',
      title: 'Espere por favor...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
          Swal.showLoading();
      },
    });

    this.usuarioService.restarConexion(this.usuarioService.uid).subscribe( () => {
      this.usuarioService.desconectado(this.usuarioService.uid).subscribe( data => {
        Swal.close();
        this.socket.emit('guardar-usuarios', data);
        this.usuarioService.logout();
      });
    });

  }

  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));

  }

  attachSignin(element) {

    this.auth2.attachClickHandler(element, {},
        (googleUser) => {

        Swal.fire({
          icon: 'warning',
          title: 'Espere por favor...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading();
          },
        });

        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token).subscribe( resp => {
            this.ngZone.run( () => {

              this.usuarioService.conectado(resp.usuario.uid).subscribe( () => {
                this.usuarioService.sumarConexion(resp.usuario.uid).subscribe(() => {
                  this.usuarioService.cargarUsuarios().subscribe( data => {
                    this.socket.emit('guardar-usuarios', data.usuarios);
                    this.router.navigateByUrl('/dashboard');
                    Swal.close();
                    this.aceptarTerminosGoolge(resp.usuario);
                  });
                });
              });

            });
          }, (err) => {
            Swal.close();
            Swal.fire({
              title: 'Error!',
              text: err.error.msg,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
        }, (error) => {
          Swal.close();
          Swal.fire({
            title: 'Error!',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
  }

  campoNoValido(campo: string): boolean{
    if (this.loginForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else {
      return false;
    }
  }

}
