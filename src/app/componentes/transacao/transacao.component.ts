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
  styleUrl: './transacao.component.scss'
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
    usuarioLogado:''
  };

  livrosEncontrados: Livro[] = [];
  usuariosEncontrados: Usuario[] = [];

  constructor(public authService: AuthService, private transacaoService: TransacaoService) {  //obter o usuário ao inicializar o componente
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
  }

  async buscarLivros(nomeLivro: string) {
    if (nomeLivro.trim() !== '') {
      this.livrosEncontrados = await this.transacaoService.buscarLivrosPorNomeParcial(nomeLivro);
    } else {
      this.livrosEncontrados = [];
    }
  }

  async buscarUsuarios(nomeUsuario: string) {
    if (nomeUsuario.trim() !== '') {
      this.usuariosEncontrados = await this.transacaoService.buscarUsuariosPorNomeParcial(nomeUsuario);
    } else {
      this.usuariosEncontrados = [];
    }
  }

  async realizarTransacao() {
    try {
      
      const livro = await this.transacaoService.obterLivroPorNome(this.transacao.livroNome);
      const livroId = livro.id;
      const usuarioId = await this.transacaoService.obterUsuarioIdPorNome(this.transacao.usuarioNome);
  
      
      const dataAtual = new Date();
      this.transacao.data = formatarData(dataAtual);
  
      const usuarioLogado = await this.transacaoService.obterUsuarioAtual();
      this.transacao.usuarioLogado = usuarioLogado;
  
      const transacaoParaAdicionar: Transacao = { ...this.transacao, livroId, usuarioId }; 
      await this.transacaoService.adicionarTransacao(transacaoParaAdicionar);
  
      
      this.transacao = {
        livroNome: '',
        usuarioNome: '',
        data: '',
        quantidadeLivros: 0,
        usuarioId: '',
        tipo: 'emprestimo',
        usuarioLogado: ''
      };
  
      
      this.livrosEncontrados = [];
      this.usuariosEncontrados = [];
  
    } catch (error) {
      console.error('Erro ao realizar transação:', error);
    }
  }

  logout():void{
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
