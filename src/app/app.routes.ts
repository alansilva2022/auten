import { Routes } from '@angular/router';
import { NaoautorizadoComponent } from './componentes/naoautorizado/naoautorizado.component';
import { HomeComponent } from './componentes/home/home.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { hasRoleGuard } from './has-role.guard';
import { Role } from './role';
import { RegistrousuarioComponent } from './componentes/registrousuario/registrousuario.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'}, 
    {path: 'naoautorizado', component: NaoautorizadoComponent},
    {path: 'home', component: HomeComponent},
    {path: 'admin', component: AdminComponent, canActivate: [hasRoleGuard], data: {roles: [Role.admin]}},
    //canActive para verificar se o utilizador atual tem permissão para acessar o componente
    //data --> dados adicionais
    //hasRoleGuard para a Route possa verificar se o utilizador pode acessar a este componente
    {path: 'registro', component: RegistrousuarioComponent}
];
