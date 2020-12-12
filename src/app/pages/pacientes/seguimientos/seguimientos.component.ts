import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Seguimiento } from '../../../models/seguimiento.model';
import { SeguimientoService } from '../../../services/seguimiento.service';

@Component({
  selector: 'app-seguimientos',
  templateUrl: './seguimientos.component.html',
  styles: [
  ]
})
export class SeguimientosComponent implements OnInit {

  public totalSeguimientos = 0;
  public seguimientos: any[];
  public seguimientosTemp: Seguimiento[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  public id;

  constructor(  private seguimientoService: SeguimientoService,
                private usuarioService: UsuarioService,
                private router: Router,
                private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      this.id = id;
      this.seguimientoService.id = id;
      this.cargarSeguimientos(id);
    });

  }

  cargarSeguimientos(id: string){
    this.cargando = true;
    this.seguimientoService.cargarSeguimientos(id).subscribe( ({seguimientos, total}) => {
        this.totalSeguimientos = total;
        this.seguimientos = seguimientos;
        this.cargando = false;
        if (this.totalSeguimientos < 6) {
          this.hasta = this.totalSeguimientos;
        }
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalSeguimientos) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalSeguimientos){
      this.hasta = this.totalSeguimientos;
    } else if (this.hasta - this.desde < 5){
      this.hasta = this.desde + 6;
    }

    this.cargarSeguimientos(this.id);
  }

  eliminarSeguimiento(seguimiento: Seguimiento){

    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Eliminar seguimiento ' + seguimiento.numero,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon: 'warning',
          title: 'Espere por favor...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
              Swal.showLoading();
          },
        });

        this.seguimientoService.eliminarSeguimiento(seguimiento.id).subscribe( resp => {
          Swal.close();
          Swal.fire(
            'Exito!',
            'Seguimiento ' + seguimiento.numero + ' eliminado.',
            'success'
          );
          this.cargarSeguimientos(this.id);
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
    });
  }

}
