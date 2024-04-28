import { Component } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../role';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],      //Para usar *ngIf é preciso importar CommonModule
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  somenteAdm: boolean = false;

  somenteUsuarioComum: boolean = false;

 //antes estava como private, mas para o html ter acesso foi preciso colocar como public
  constructor(public authService: AuthService){

    this.authService.utilizadorAtual$.subscribe(user => {
      console.log('Usuário atual:', user);
      this.isAdmin();
      this.isUsuarioComum();
    });
  }

  user$ = this.authService.utilizadorAtual$; //para ver o email logado



  logout():void{
    this.authService.logout();

  }

  isAdmin(): void {
    this.authService.getUserRole().then(role => {
      if (role === Role.Admin) {
        // Usuário é admin, mostrar o botão 
        this.somenteAdm = true;
      } else {
        // Usuário não é admin, não mostrar o botão
        this.somenteAdm = false;
      }
    }).catch(error => {
      console.error('Erro ao verificar permissões:', error);
      // Em caso de erro, não mostrar o botão
      this.somenteAdm = false;
    });
  }

  isUsuarioComum(): void {
    this.authService.getUserRole().then(role => {
      if (role !== Role.Admin) {
        // Usuário não é adm, mostrar o botão 
        this.somenteUsuarioComum = true;
      } else {
        // Usuário é adm, não mostrar o botão
        this.somenteUsuarioComum = false;
      }
    }).catch(error => {
      console.error('Erro ao verificar permissões:', error);
      // Em caso de erro, não mostrar o botão
      this.somenteUsuarioComum = false;
    });
  }
  

}
