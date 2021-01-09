import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { CryptoPipe } from './crypto.pipe';



@NgModule({
  declarations: [
    ImagenPipe,
    CryptoPipe
  ],
  imports: [],
  exports: [
    ImagenPipe,
    CryptoPipe
  ]
})
export class PipesModule { }
