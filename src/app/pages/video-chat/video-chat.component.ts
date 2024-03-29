
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SalasService } from '../../services/salas.service';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sala } from '../../models/sala.model';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';
import { CryptoService } from '../../services/crypto.service';


const socket_url = environment.socket_url;
const clave_crypt = environment.clave_crypt;

declare var Peer: any;


@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {

  private uuid;
  public socket = io(socket_url);
  public options = {
    video: true,
    audio: true
  };

  private myPeer = new Peer(undefined, {
    // host: 'psicoandymd.com',
    host: '143.198.131.193',
    port: 3001,
    secure: true
  });

  // private myPeer = new Peer();

  public peers;
  public videoGrid;
  public myVideo;
  public stream;
  public remoteStream = null;
  public sala;

  constructor(  private salasService: SalasService,
                private usuarioService: UsuarioService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private cryptoService: CryptoService) {}
  ngOnDestroy(): void {
    this.options.video = false;
    this.options.audio = false;
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    this.options.video = false;
    this.options.audio = false;
    this.salir();
  }

  ngOnInit(): void {

    this.videoGrid = document.getElementById('video-grid');
    this.myVideo = document.createElement('video');
    this.myVideo.muted = true;
    this.myVideo.className = 'local-video';
    this.peers = {};

    this.activatedRoute.params.subscribe( ({uuid}) => {
      this.uuid = uuid;
      this.salasService.getSala(this.uuid).subscribe( (sala: Sala) => {

          if (sala.origen === this.usuarioService.uid || sala.destino === this.usuarioService.uid){
            this.salasService.agregarSalaCon(this.uuid).subscribe( resp => {
            }, err => {
              this.salir();
            });
          }
      }, err => {
        this.salir();
      });
    });

    if (navigator.mediaDevices){
      navigator.mediaDevices.getUserMedia(this.options).then(stream => {
        this.stream = stream;
        this.addVideoStream(this.myVideo, this.stream);

        this.myPeer.on('call', call => {
          call.answer(this.stream);
          const video = document.createElement('video');
          video.className = 'remote-video';
          call.on('stream', userVideoStream => {
            this.remoteStream = userVideoStream;
            this.addVideoStream(video, userVideoStream);
          }, error => {
            Swal.fire({
              icon: 'error',
              title: 'Lo siento',
              text: error
            });
          });
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Lo siento',
            text: error
          });
        });

        this.socket.on('user-connected', userId => {
          this.connectToNewUser(userId, this.stream);
        });
      }).catch( error => {
        Swal.fire({
          icon: 'error',
          title: 'Lo siento',
          text: error.message
        });
        this.salir();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lo siento',
        text: 'Revise sus dispositivos de audio y video'
      });
      this.salir();
    }

    this.socket.on('nuevo-eliminada', function(data) {
      if (data === this.uuid){
       if (this.stream){
         this.stream.getTracks().forEach((track) => {
           if (track.readyState === 'live') {
             track.stop();
           }
         });
       }
       this.router.navigateByUrl('/mensajes');
      }
     }.bind(this));

    this.socket.on('user-disconnected', userId => {
      if (this.peers[userId]) {
        this.peers[userId].close();
      }
    });

    this.socket.on('nuevo-rechazada', data => {
      if (data.origen === this.usuarioService.uid){
        Swal.fire({
          icon: 'error',
          title: 'Lo siento',
          text: 'El usuario ha rechazado la llamada'
        });

        this.salir();
      }
    });

    this.myPeer.on('open', id => {
      this.socket.emit('join-room', this.uuid, id);
    });
  }

  connectToNewUser(userId, stream) {
    const call = this.myPeer.call(userId, stream);
    const video = document.createElement('video');
    video.className = 'remote-video';
    call.on('stream', userVideoStream => {
      this.remoteStream = userVideoStream;
      this.addVideoStream(video, userVideoStream);
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Lo siento',
        text: error
      });
    });
    call.on('close', () => {
      video.remove();
    });

    this.peers[userId] = call;
  }

  addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    this.videoGrid.append(video);
  }

  descativarCamara(){
    this.stream.getTracks().forEach((track) => {
      if (track.readyState === 'live' && track.kind === 'video') {
        track.enabled = false;
        this.options.video = false;
      }
    });
  }

  desactivarAudio(){
    this.stream.getTracks().forEach((track) => {
      if (track.readyState === 'live' && track.kind === 'audio') {
        track.enabled = false;
        this.options.audio = false;
      }
    });
  }

  ativarCamara(){
    this.stream.getTracks().forEach((track) => {
      if (track.readyState === 'live' && track.kind === 'video') {
        track.enabled = true;
        this.options.video = true;
      }
    });
  }

  activarAudio(){
    this.stream.getTracks().forEach((track) => {
      if (track.readyState === 'live' && track.kind === 'audio') {
        track.enabled = true;
        this.options.audio = true;
      }
    });
  }

  salir(){

    if (this.usuarioService.rol !== 'USER_ROL'){
      this.socket.emit('sala-eliminada', this.uuid);
      this.salasService.eliminarSala(this.uuid).subscribe( resp => {
        window.close();
      });

    } else {
      this.salasService.eliminarSalaCon(this.uuid).subscribe();
      this.router.navigateByUrl('/mensajes');
    }

    this.socket.on('user-disconnected', userId => {
      if (this.peers[userId]) {
        this.peers[userId].close();
      }
    });

    if (this.stream){
      this.stream.getTracks().forEach((track) => {
        if (track.readyState === 'live') {
          track.enabled = false;
          track.stop();
        }
      });
    }
  }
}
