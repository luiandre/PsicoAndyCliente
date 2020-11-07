import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonaComponent } from './dona/dona.component';
import { ModalImagenComponent } from './modal-imagen/modal-imagen.component';



@NgModule({
  declarations: [
    IncrementadorComponent,
    DonaComponent,
    ModalImagenComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule
  ], exports: [
    IncrementadorComponent,
    DonaComponent,
    ModalImagenComponent
  ]
})
export class ComponentsModule { }
