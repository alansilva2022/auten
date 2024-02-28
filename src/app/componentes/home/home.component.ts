import { Component } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],      //Para usar *ngIf é preciso importar CommonModule
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

 //antes estava como private, mas para o html ter acesso foi preciso colocar como public
  constructor(public authService: AuthService){}

  user$ = this.authService.utilizadorAtual$; //para ver o email logado



  logout():void{
    this.authService.logout();

  }

  


}
