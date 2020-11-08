import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';

import { InicioComponent } from './inicio/inicio.component';
import { ConocenosComponent } from './conocenos/conocenos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { PublicComponent } from './public.component';
import { PipesModule } from '../pipes/pipes.module';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';


@NgModule({
  declarations: [
    InicioComponent,
    ConocenosComponent,
    ServiciosComponent,
    ContactanosComponent,
    PublicComponent,
    TerminosCondicionesComponent
  ],
  exports: [
    InicioComponent,
    ConocenosComponent,
    ServiciosComponent,
    ContactanosComponent,
    PublicComponent,
    TerminosCondicionesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    PipesModule
  ]
})
export class PublicModule { }
