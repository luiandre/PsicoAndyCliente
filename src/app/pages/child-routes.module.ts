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

const childRoutes: Routes = [

  // Rutas  Admin y Prof
  { path: '', canLoad: [ProfGuard], canActivate: [ProfGuard], component: DashboardComponent, data: {titulo: 'Dashboard'}},
  { path: 'noticias', canLoad: [ProfGuard], canActivate: [ProfGuard], component: NoticiasComponent, data: {titulo: 'Noticias'}},
  { path: 'noticias/:id', canActivate: [ProfGuard], component: NoticiaComponent, data: {titulo: 'Noticia'}},
  { path: 'servicios', canLoad: [ProfGuard], canActivate: [ProfGuard], component: ServiciosComponent, data: {titulo: 'Servicios'}},
  { path: 'servicios/:id', canLoad: [ProfGuard], canActivate: [ProfGuard], component: ServicioComponent, data: {titulo: 'Servicio'}},

  //  Rutas admin
  { path: 'usuarios', canLoad: [AdminGuard], canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Usuarios'}},
];

@NgModule({
  imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }
