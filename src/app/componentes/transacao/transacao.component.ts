import { Component } from '@angular/core';
import { Transacao } from '../transacao';
import { TransacaoService } from '../../servicos/transacao.service';
import { Usuario } from '../usuario';
import { Livro } from '../livro';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-transacao',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.scss'] 
})
export class TransacaoComponent {

  usuarioLogado: string = '';
    
  transacao: Transacao = {
    tipo: 'emprestimo',
    livroNome: '',
    usuarioNome: '',
    data: '',
    quantidadeLivros: 0,
    usuarioId: '',
    usuarioLogado: ''
  };

  livrosEncontrados: Livro[] = [];
  usuariosEncontrados: Usuario[] = [];

  constructor(public authService: AuthService, private transacaoService: TransacaoService) {
    this.initializeUser();
  }

  private async initializeUser() {
    try {
      this.usuarioLogado = await this.authService.obterNomeUsuario();
    } catch (error) {
      console.error('Erro ao obter nome de usuário:', error);
    }
  }

  async buscarLivros(nomeLivro: string) {
    if (nomeLivro.trim() === '') {
      this.livrosEncontrados = [];
      return;
    }
    try {
      this.livrosEncontrados = await this.transacaoService.buscarLivrosPorNomeParcial(nomeLivro);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  }

  async buscarUsuarios(nomeUsuario: string) {
    if (nomeUsuario.trim() === '') {
      this.usuariosEncontrados = [];
      return;
    }
    try {
      this.usuariosEncontrados = await this.transacaoService.buscarUsuariosPorNomeParcial(nomeUsuario);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }

  async realizarTransacao() {
    try {
      if (!this.transacao.livroNome || !this.transacao.usuarioNome) {
        throw new Error('Nome do livro e do usuário são obrigatórios');
      }

      const livro = await this.transacaoService.obterLivroPorNome(this.transacao.livroNome);
      const livroId = livro.id;
      const usuarioId = await this.transacaoService.obterUsuarioIdPorNome(this.transacao.usuarioNome);

      this.transacao.data = formatarData(new Date());

      const usuarioLogado = await this.authService.obterUsuarioAtual();
      this.transacao.usuarioLogado = usuarioLogado?.uid || '';

      const transacaoParaAdicionar: Transacao = { ...this.transacao, livroId, usuarioId }; 
      await this.transacaoService.adicionarTransacao(transacaoParaAdicionar);

      this.resetForm();
    } catch (error) {
      console.error('Erro ao realizar transação:', error);
    }
  }

  private resetForm() {
    this.transacao = {
      tipo: 'emprestimo',
      livroNome: '',
      usuarioNome: '',
      data: '',
      quantidadeLivros: 0,
      usuarioId: '',
      usuarioLogado: ''
    };
    this.livrosEncontrados = [];
    this.usuariosEncontrados = [];
  }

  logout(): void {
    this.authService.logout();
  }

}

function formatarData(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Os meses começam do zero
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}
