import { Component, OnInit } from '@angular/core';
import { Transacao } from '../transacao';
import { TransacaoService } from '../../servicos/transacao.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-consultartrasacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultartrasacao.component.html',
  styleUrl: './consultartrasacao.component.scss'
})
export class ConsultartrasacaoComponent implements OnInit {

  transacoes: Transacao[] = [];

  usuarioLogado: string = '';

  constructor(private transacaoService: TransacaoService, public authService: AuthService) {
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
   }


  ngOnInit(): void {
    this.obterTransacoes();
  }

  async obterTransacoes() {
    try {
      this.transacoes = await this.transacaoService.consultarTransacoes();
    } catch (error) {
      console.error('Erro ao obter transações:', error);
    }
  }

  logout():void{
    this.authService.logout();

  }


}
