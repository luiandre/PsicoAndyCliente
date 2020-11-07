import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: [
  ]
})
export class InicioComponent implements OnInit {

  public noticias: Noticia[] = [];

  constructor(  private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.noticiasService.cargarNoticias()
    .subscribe( resp => {
      this.noticias = resp.noticias;
    });
  }

}
