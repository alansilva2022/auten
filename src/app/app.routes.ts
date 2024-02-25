import { Routes } from '@angular/router';
import { NaoautorizadoComponent } from './componentes/naoautorizado/naoautorizado.component';
import { HomeComponent } from './componentes/home/home.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { hasRoleGuard } from './has-role.guard';
import { Role } from './role';
import { RegistrousuarioComponent } from './componentes/registrousuario/registrousuario.component';
import { LoginComponent } from './componentes/login/login.component';

import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard';


const redirecionarParaLogin = () => redirectUnauthorizedTo(['login']);
const redirecionarParaHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'}, 
    {path: 'naoautorizado', component: NaoautorizadoComponent},
    {path: 'home', component: HomeComponent, ...canActivate(redirecionarParaLogin)}, // só vai para página home de estiver logado
    {path: 'admin', component: AdminComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: {roles: [Role.admin]}},
    //canActive para verificar se o utilizador atual tem permissão para acessar o componente
    //data --> dados adicionais
    //hasRoleGuard para a Route possa verificar se o utilizador pode acessar a este componente
    {path: 'registro', component: RegistrousuarioComponent},
    {path: 'login', component: LoginComponent, ...canActivate(redirecionarParaHome)} //se fizer login, redireciona para home
];
