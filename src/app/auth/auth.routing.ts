import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { AuthGuard } from '../guards/auth.guard';
import { VideoChatComponent } from '../pages/video-chat/video-chat.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'recuperar-password', component: RecuperarPasswordComponent},
    { path: 'video/:uuid', canActivate: [AuthGuard], component: VideoChatComponent, data: {titulo: 'VideoChat'}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
