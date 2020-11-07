import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Noticia } from '../../models/noticia.model';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public cargando = false;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[];
  public noticias: Noticia[] = [];
  public servicios: Servicio[] = [];

  constructor(  private activatedRouter: ActivatedRoute,
                private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe( ({ termino }) => {
      this.busquedaTodo( termino );
    });
  }

  busquedaTodo( termino: string){
    this.cargando = true;
    this.usuariosTemp = [];
    this.usuarios = [];
    this.noticias = [];
    this.servicios = [];
    this.busquedasService.buscarTodo(termino).subscribe( (resp: any) => {

      this.usuariosTemp = resp.usuarios;

      this.usuariosTemp.forEach( (usuario: Usuario) => {
        if (usuario){
          if ( usuario.rol !== 'USER_ROL'){
            this.usuarios.push(usuario);
          }
        }
      });

      this.noticias = resp.noticias;
      this.servicios = resp.servicios;

      this.cargando = false;
    });
  }

}
