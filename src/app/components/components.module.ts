import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonaComponent } from './dona/dona.component';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';
import { ModalAsignacionComponent } from './modal-asignacion/modal-asignacion.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    DonaComponent,
    ModalImagenComponent,
    ModalAsignacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule
  ], exports: [
    IncrementadorComponent,
    DonaComponent,
    ModalImagenComponent,
    ModalAsignacionComponent
  ]
})
export class ComponentsModule { }
