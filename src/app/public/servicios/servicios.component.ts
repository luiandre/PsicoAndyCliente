import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import { Servicio } from '../../models/servicio.model';
import { ServicioResponsable } from '../../interfaces/responsable-servicio.interface';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styles: [
  ]
})
export class ServiciosComponent implements OnInit {

  public servicios: any[] = [];
  public uid;
  public cargando = true;

  constructor(  private serviciosService: ServiciosService,
                private router: Router,
                public usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios() {
    this.cargando = true;
    this.serviciosService.cargarServicios(0).subscribe( resp => {
      this.servicios = resp.servicios;
      this.cargando = false;
    });
  }

  enviarMensaje(uid: string){
    this.router.navigateByUrl(`/mensajes/${uid}`);
  }

}
