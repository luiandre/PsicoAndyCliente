import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    RecuperarPasswordComponent,
  ],
  exports:[
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }
