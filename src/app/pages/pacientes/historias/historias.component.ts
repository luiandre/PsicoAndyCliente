import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Asignacion } from 'src/app/models/asignacion.model';
import { AsignacionService } from 'src/app/services/asignacion.service';

import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../../services/usuario.service';
import { HistoriasService } from '../../../services/historias.service';
import { Router } from '@angular/router';
import { Historia } from 'src/app/models/historia.model';
import { CryptoService } from '../../../services/crypto.service';


const socket_url = environment.socket_url;
const clave_crypt = environment.clave_crypt;

@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html',
  styles: [
  ]
})
export class HistoriasComponent implements OnInit {

  public totalAsignaciones = 0;
  public asignaciones: any[];
  public asignacionesTemp: Asignacion[];
  public desde = 0;
  public hasta = 6;
  public cargando = true;
  public socket = io(socket_url);

  constructor(private asignacionService: AsignacionService,
              private usuarioService: UsuarioService,
              private historiasService: HistoriasService,
              private router: Router,
              private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.cargarAsignaciones(this.usuarioService.uid);

    this.socket.on('nuevo-asignacion', function(data) {
      if (data.profesional._id === this.usuarioService.uid || data.profesional === this.usuarioService.uid){
        this.cargarAsignaciones(this.usuarioService.uid);
      }
    }.bind(this));
  }

  public cargarAsignaciones(uid: string) {
    this.cargando = true;
    this.asignacionService.getAsignacionesProfesional(uid, this.desde).subscribe( ({total, asignaciones}) => {
      this.totalAsignaciones = total;
      this.asignaciones = asignaciones;
      this.cargando = false;
      if (this.totalAsignaciones < 6) {
        this.hasta = this.totalAsignaciones;
      }
    });
  }

  cambiarPagina( valor: number) {
    this.desde += valor;
    this.hasta += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalAsignaciones) {
      this.desde -= valor;
    }

    if (this.hasta > this.totalAsignaciones){
      this.hasta = this.totalAsignaciones;
    } else if (this.hasta - this.desde < 5){
      this.hasta = this.desde + 6;
    }

    this.cargarAsignaciones(this.usuarioService.uid);
  }

  revisarHistoria(asignacion: Asignacion | any){
    this.historiasService.getHistoria(asignacion.paciente._id).subscribe( resp => {
      this.router.navigateByUrl(`/dashboard/historias/${asignacion.paciente._id}`);
    }, err => {
      if (err.error.msg === 'Sin historia'){

        const nombres = this.cryptoService.set(clave_crypt, asignacion.paciente.nombre);
        const apellidos = this.cryptoService.set(clave_crypt, asignacion.paciente.apellido);
        const email = this.cryptoService.set(clave_crypt, asignacion.paciente.email);

        const historia: Historia = {
          entrevistador: this.usuarioService.uid,
          usuario: asignacion.paciente._id,
          nombres,
          apellidos,
          email
        };
        this.historiasService.crearHistoria(historia).subscribe( resp => {
          this.router.navigateByUrl(`/dashboard/historias/${asignacion.paciente._id}`);
        });
      }
    }
    );
  }

}
