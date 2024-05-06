import { Routes } from '@angular/router';
import { NaoautorizadoComponent } from './componentes/naoautorizado/naoautorizado.component';
import { HomeComponent } from './componentes/home/home.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { hasRoleGuard } from './has-role.guard';
import { Role } from './role';
import { RegistrousuarioComponent } from './componentes/registrousuario/registrousuario.component';
import { LoginComponent } from './componentes/login/login.component';

import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard';
import { CadastrarLivroComponent } from './componentes/cadastrar-livro/cadastrar-livro.component';
import { TransacaoComponent } from './componentes/transacao/transacao.component';
import { ReservaComponent } from './componentes/reserva/reserva.component';
import { MinhasreservasComponent } from './componentes/minhasreservas/minhasreservas.component';
import { ConsultausuarioComponent } from './componentes/consultausuario/consultausuario.component';
import { ConsultartrasacaoComponent } from './componentes/consultartrasacao/consultartrasacao.component';
import { PesquisarlivroComponent } from './componentes/pesquisarlivro/pesquisarlivro.component';
import { RelatoriolivroComponent } from './componentes/relatoriolivro/relatoriolivro.component';
import { ComentarioComponent } from './componentes/comentario/comentario.component';
import { DetalhesLivroComponent } from './componentes/detalhes-livro/detalhes-livro.component';


const redirecionarParaLogin = () => redirectUnauthorizedTo(['login']);
const redirecionarParaHome = () => redirectLoggedInTo(['home']);

export const routes: Routes = [
    //{path: '', redirectTo: 'login', pathMatch: 'full'}, comentado 05/05/2024
    {path: 'naoautorizado', component: NaoautorizadoComponent},
    {path: 'home', component: HomeComponent, ...canActivate(redirecionarParaLogin)}, // só vai para página home de estiver logado
    
    { path: 'admin', component: AdminComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] } },
    //canActive para verificar se o utilizador atual tem permissão para acessar o componente
    //data --> dados adicionais
    //hasRoleGuard para a Route possa verificar se o utilizador pode acessar a este componente
    {path: 'registro', component: RegistrousuarioComponent,...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] }},
    {path: 'login', component: LoginComponent, ...canActivate(redirecionarParaHome)}, //se fizer login, redireciona para home
    {path: 'cadastrarlivro', component: CadastrarLivroComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] }},
    {path: 'transacao', component: TransacaoComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] }},
    {path: 'reserva', component: ReservaComponent, ...canActivate(redirecionarParaLogin)},
    {path: 'reservaporusuario', component: MinhasreservasComponent, ...canActivate(redirecionarParaLogin)},
    {path: 'buscarusuario', component: ConsultausuarioComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] }},
    {path: 'historicotransacoes', component: ConsultartrasacaoComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] }},
    {path: 'pesquisarlivro', component: PesquisarlivroComponent},
    {path: 'relatoriolivro', component: RelatoriolivroComponent, ...canActivate(redirecionarParaLogin), canActivate: [hasRoleGuard], data: { roles: [Role.Admin] }},
    {path: 'comentariolivro', component: ComentarioComponent, ...canActivate(redirecionarParaLogin)},
    { path: 'detalhes-livro/:id', component: DetalhesLivroComponent },
    { path: '', redirectTo: '/pesquisarlivro', pathMatch: 'full' }
  
  
];
