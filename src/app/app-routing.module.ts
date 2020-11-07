import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { InicioComponent } from './public/inicio/inicio.component';
import { ServiciosComponent } from './public/servicios/servicios.component';
import { ConocenosComponent } from './public/conocenos/conocenos.component';
import { ContactanosComponent } from './public/contactanos/contactanos.component';
import { PublicComponent } from './public/public.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { AuthGuard } from './guards/auth.guard';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { MensajeDetalleComponent } from './pages/mensajes/mensaje-detalle/mensaje-detalle.component';

const routes: Routes = [

  // path: '/dashboard' PageRouting
  // path: '/auth' AuthRouting

  { path: '', component: PublicComponent, children: [
    { path: 'inicio', component: InicioComponent, data: {titulo: 'Inicio'}},
    { path: 'servicios', component: ServiciosComponent, data: {titulo: 'Servicios'}},
    { path: 'conocenos', component: ConocenosComponent, data: {titulo: 'Conócenos'}},
    { path: 'contactanos', component: ContactanosComponent, data: {titulo: 'Contáctanos'}},
    { path: 'perfil', canActivate: [AuthGuard], component: PerfilComponent, data: {titulo: 'Perfíl'}},
    { path: 'mensajes', canActivate: [AuthGuard], component: MensajesComponent, data: {titulo: 'Mensajes'}},
    { path: 'mensajes/:uid', canActivate: [AuthGuard], component: MensajeDetalleComponent, data: {titulo: 'Mensajes'}},
    // { path: 'account-settings', canActivate: [AuthGuard], component: AccountSettingsComponent, data: {titulo: 'Ajustes'}},
    { path: 'buscar/:termino', component: BusquedaComponent, data: {titulo: 'Resultados de la búsqueda'}},
    { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  ]},
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: '**', component: NopagefoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot( routes ),
    PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
