import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

const socket_url = environment.socket_url;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: [
  ]
})
export class InicioComponent implements OnInit {

  public noticias: Noticia[] = [];
  public cargando = true;
  public socket = io(socket_url);

  constructor(  private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.cargarNoticias();

    this.socket.on('nuevo-noticia', function(data) {
      this.cargarNoticias();
    }.bind(this));
  }

  cargarNoticias() {
    this.cargando = true;
    this.noticias = [];
    this.noticiasService.cargarNoticiasAll()
    .subscribe( resp => {
      this.noticias = resp.noticias;
      this.cargando = false;
    });
  }

}
