import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from 'src/app/models/mensaje.model';
import { MensajeService } from 'src/app/services/mensajes.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { SalasService } from '../../../services/salas.service';
import Swal from 'sweetalert2';
import { Sala } from 'src/app/models/sala.model';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { CryptoService } from '../../../services/crypto.service';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-mensaje-detalle',
  templateUrl: './mensaje-detalle.component.html',
  styleUrls: ['../mensajes.component.css'],
})
export class MensajeDetalleComponent implements OnInit {

  @ViewChild('scrollMe', {static: false}) private myScrollContainer: ElementRef;

  public clave_crypt = environment.clave_crypt;
  public mensajes: Mensaje[] = [];
  public usuarioSeleccionado: Usuario = new Usuario('', '', '', '', null);
  public uid;
  public mensajeNuevo: Mensaje;
  public socket = io(socket_url);
  public contador = 0;

  constructor(  private mensajesService: MensajeService,
                public usuarioService: UsuarioService,
                private activatedRoute: ActivatedRoute,
                private salasService: SalasService,
                private router: Router,
                private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.mensajeNuevo = new Mensaje('', '', '');

    this.activatedRoute.params.subscribe( ({uid}) => {

      this.usuarioService.getUsuario(uid).subscribe( (usuario: Usuario) => {
      }, err => {
        this.router.navigateByUrl('/mensajes');
      });

      this.uid = uid;
      this.cargarMensajes(uid);
    });

    this.usuarioService.getUsuario(this.uid).subscribe( usuario => {
      this.usuarioSeleccionado = usuario;
    });

    this.socket.on('nuevo-mensaje', function(data: Mensaje){

      const mensajeRecibido: Mensaje = {
        de: { _id: data.de },
        para: { _id: data.para },
        fecha: data.fecha,
        mensaje: data.mensaje,
        id: data.id,
        pendiente: data.pendiente
      };

      this.mensajes.push(mensajeRecibido);

    }.bind(this));

    this.socket.on('nuevo-usuarios', function(data) {
      this.usuarioService.getUsuario(this.uid).subscribe( usuario => {
        this.usuarioSeleccionado = usuario;
      });
    }.bind(this));

    this.obtenerUltimoMensaje();
  }

  cargarMensajes(uid: string){
    this.mensajesService.cargarMensajes(uid).subscribe( mensajes => {
      this.mensajes = mensajes;
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  onSubmit(mensajeForm){
    if (!mensajeForm.valid || this.mensajeNuevo.mensaje === ''){
      return;
    }

    const encrypted = this.cryptoService.set(this.clave_crypt, this.mensajeNuevo.mensaje);

    const mensajeEnviar: Mensaje = {
      de: this.usuarioService.uid,
      para: this.usuarioSeleccionado.uid,
      mensaje: encrypted
    };

    this.mensajesService.enviarMensaje(mensajeEnviar).subscribe( (resp: Mensaje) => {
      this.socket.emit('guardar-mensaje', resp.mensaje);
      this.scrollToBottom();
      this.mensajeNuevo.mensaje = '';
    });

  }

  llamar(uid: string){

    this.salasService.getSalas().subscribe( (resp: any[]) => {
      this.contador = 0;
      resp.forEach( sala => {
        if ( uid === sala.origen || uid === sala.destino){
          this.contador = this.contador + 1;
        }
      });

      if (this.contador > 0){
        Swal.fire({
          icon: 'error',
          title: 'Lo siento',
          text: 'El usuario esta en otra sala',
        });
      } else {
        this.salasService.crearSala(uid).subscribe( (sala: Sala) => {
          this.socket.emit('guardar-llamada', sala);
          this.router.navigateByUrl(`/video/${sala.uuid}`);
        });
      }
      });
  }

  obtenerUltimoMensaje(){
    this.mensajesService.getUltimoRecibido(this.uid).subscribe( (mensaje) => {
      if (mensaje[0]){
        if (mensaje[0].pendiente){
          this.mensajesService.desactivarPendiente(mensaje[0].id).subscribe();
        }

      }
    });
  }
}
