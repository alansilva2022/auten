import { Component } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../role';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  somenteAdm: boolean = false;
  somenteUsuarioComum: boolean = false;

  constructor(public authService: AuthService) {
    this.authService.utilizadorAtual$.subscribe(user => {
      console.log('Usuário atual:', user);
      this.isAdmin();
      this.isUsuarioComum();
    });
  }

  user$ = this.authService.utilizadorAtual$;

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): void {
    this.authService.getUserRole().then(role => {
      this.somenteAdm = (role === Role.Admin);
    }).catch(error => {
      console.error('Erro ao verificar permissões:', error);
      this.somenteAdm = false;
    });
  }

  isUsuarioComum(): void {
    this.authService.getUserRole().then(role => {
      this.somenteUsuarioComum = (role !== Role.Admin);
    }).catch(error => {
      console.error('Erro ao verificar permissões:', error);
      this.somenteUsuarioComum = false;
    });
  }
}
