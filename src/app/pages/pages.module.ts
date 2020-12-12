import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

import { LinkyModule } from 'ngx-linky';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './gestion/usuarios/usuarios.component';
import { NoticiasComponent } from './gestion/noticias/noticias.component';
import { ServiciosComponent } from './gestion/servicios/servicios.component';
import { NoticiaComponent } from './gestion/noticias/noticia/noticia.component';
import { ServicioComponent } from './gestion/servicios/servicio/servicio.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { MensajeDetalleComponent } from './mensajes/mensaje-detalle/mensaje-detalle.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { ComunicadoComponent } from './gestion/comunicados/comunicado/comunicado.component';
import { ComunicadosComponent } from './gestion/comunicados/comunicados.component';
import { HistoriasComponent } from './pacientes/historias/historias.component';
import { AsignacionesComponent } from './pacientes/asignaciones/asignaciones.component';
import { AsignacionComponent } from './pacientes/asignaciones/asignacion/asignacion.component';
import { HistoriaComponent } from './pacientes/historias/historia/historia.component';
import { SeguimientosComponent } from './pacientes/seguimientos/seguimientos.component';
import { SeguimientoComponent } from './pacientes/seguimientos/seguimiento/seguimiento.component';
import { CitasComponent } from './pacientes/citas/citas.component';
import { TestAutoestimaComponent } from './test-autoestima/test-autoestima.component';


@NgModule({
  declarations: [
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    PerfilComponent,
    UsuariosComponent,
    NoticiasComponent,
    ServiciosComponent,
    NoticiaComponent,
    ServicioComponent,
    BusquedaComponent,
    MensajesComponent,
    MensajeDetalleComponent,
    VideoChatComponent,
    ComunicadoComponent,
    ComunicadosComponent,
    AsignacionesComponent,
    AsignacionComponent,
    HistoriasComponent,
    HistoriaComponent,
    SeguimientosComponent,
    SeguimientoComponent,
    CitasComponent,
    TestAutoestimaComponent
  ],
  exports: [
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    MensajesComponent,
    MensajeDetalleComponent,
    VideoChatComponent,
    ComunicadoComponent,
    ComunicadosComponent,
    HistoriasComponent,
    AsignacionComponent,
    AsignacionesComponent,
    HistoriaComponent,
    SeguimientosComponent,
    SeguimientoComponent,
    CitasComponent,
    TestAutoestimaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule,
    LinkyModule
  ]
})
export class PagesModule { }
