import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfGuard } from '../guards/prof.guard';
import { AdminGuard } from '../guards/admin.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './gestion/usuarios/usuarios.component';
import { NoticiasComponent } from './gestion/noticias/noticias.component';
import { ServiciosComponent } from './gestion/servicios/servicios.component';
import { NoticiaComponent } from './gestion/noticias/noticia/noticia.component';
import { ServicioComponent } from './gestion/servicios/servicio/servicio.component';
import { ComunicadosComponent } from './gestion/comunicados/comunicados.component';
import { ComunicadoComponent } from './gestion/comunicados/comunicado/comunicado.component';
import { HistoriasComponent } from './pacientes/historias/historias.component';
import { AsignacionesComponent } from './pacientes/asignaciones/asignaciones.component';
import { AsignacionComponent } from './pacientes/asignaciones/asignacion/asignacion.component';

const childRoutes: Routes = [

  // Rutas  Admin y Prof
  { path: '', canLoad: [ProfGuard], canActivate: [ProfGuard], component: DashboardComponent, data: {titulo: 'Principal'}},
  { path: 'noticias', canLoad: [ProfGuard], canActivate: [ProfGuard], component: NoticiasComponent, data: {titulo: 'Noticias'}},
  { path: 'noticias/:id', canActivate: [ProfGuard], component: NoticiaComponent, data: {titulo: 'Noticia'}},
  { path: 'servicios', canLoad: [ProfGuard], canActivate: [ProfGuard], component: ServiciosComponent, data: {titulo: 'Servicios'}},
  { path: 'servicios/:id', canLoad: [ProfGuard], canActivate: [ProfGuard], component: ServicioComponent, data: {titulo: 'Servicio'}},
  { path: 'comunicados', canLoad: [ProfGuard], canActivate: [ProfGuard], component: ComunicadosComponent, data: {titulo: 'Comunicados'}},
  { path: 'comunicados/:id', canLoad: [ProfGuard], canActivate: [ProfGuard], component: ComunicadoComponent, data: {titulo: 'Comunicado'}},
  { path: 'historias', canLoad: [ProfGuard], canActivate: [ProfGuard], component: HistoriasComponent, data: {titulo: 'Historias Clínicas'}},

  //  Rutas admin
  { path: 'usuarios', canLoad: [AdminGuard], canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Usuarios'}},
  { path: 'asignaciones', canLoad: [AdminGuard], canActivate: [AdminGuard], component: AsignacionesComponent, data: {titulo: 'Listado de Pacientes'}},
  { path: 'asignaciones/:uid', canLoad: [AdminGuard], canActivate: [AdminGuard], component: AsignacionComponent, data: {titulo: 'Asignación de Profesionales'}},
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }
