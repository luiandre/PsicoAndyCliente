import { Component, OnInit } from '@angular/core';
import { Noticia } from '../../models/noticia.model';
import { NoticiasService } from '../../services/noticia.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  public noticia: Noticia;
  constructor(  private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.cargarNoticia();
  }

  cargarNoticia(){
    this.noticiasService.cargarNoticias(0, 1).subscribe(resp => {
      if ( resp.noticias.length !== 0){
        this.noticia = resp.noticias[0];
      }
    });
  }

}
