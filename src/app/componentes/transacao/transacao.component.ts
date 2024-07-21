import { Component, OnInit } from '@angular/core';
import { Transacao } from '../transacao';
import { TransacaoService } from '../../servicos/transacao.service';
import { Usuario } from '../usuario';
import { Livro } from '../livro';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicos/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transacao',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, MatSnackBarModule],
  templateUrl: './transacao.component.html',
  styleUrls: ['./transacao.component.scss']
})
export class TransacaoComponent implements OnInit {
  usuarioLogado: string = '';
  transacao: Transacao = {
    tipo: 'emprestimo',
    livroNome: '',
    usuarioNome: '',
    data: '',
    quantidadeLivros: 0,
    livroId: '',
    usuarioId: '',
    usuarioLogado: ''
  };

  livrosEncontrados: Livro[] = [];
  usuariosEncontrados: Usuario[] = [];
  dataAtualFormatada: string = '';

  constructor(public authService: AuthService, private transacaoService: TransacaoService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.initializeUser();
    this.dataAtualFormatada = this.formatarData(new Date());
  }

  public async initializeUser() {
    try {
      const usuarioAtual = await this.authService.obterUsuarioAtual(); 
      if (usuarioAtual) {
        this.usuarioLogado = await this.authService.obterNomeUsuario();
      }
    } catch (error) {
      console.error('Erro ao obter nome de usuário:', error);
    }
  }

  public async buscarLivros(nomeLivro: string) {
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

  public async buscarUsuarios(nomeUsuario: string) {
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

  public selecionarLivro(livro: Livro) {
    if (livro) {
      this.transacao.livroNome = livro.titulo;
      this.transacao.livroId = livro.id || ''; 
      this.livrosEncontrados = []; 
    }
  }

  public selecionarUsuario(usuario: Usuario) {
    if (usuario) {
      this.transacao.usuarioNome = usuario.nomeUsuario;
      this.transacao.usuarioId = usuario.id || ''; 
      this.usuariosEncontrados = []; 
    }
  }

  public async realizarTransacao() {
    try {
      if (!this.transacao.livroNome || !this.transacao.usuarioNome) {
        throw new Error('Nome do livro e do usuário são obrigatórios');
      }
  
      const livro = await this.transacaoService.obterLivroPorNome(this.transacao.livroNome);
      const livroId = livro.id; 
      if (!livroId) {
        throw new Error('ID do livro não definido');
      }
      console.log('Livro ID:', livroId);
  
      const usuarioId = await this.transacaoService.obterUsuarioIdPorNome(this.transacao.usuarioNome);
      if (!usuarioId) {
        throw new Error('ID do usuário não definido');
      }
      console.log('Usuário ID:', usuarioId);
  
      this.transacao.data = this.formatarData(new Date());
      const usuarioLogado = await this.authService.obterUsuarioAtual();
      this.transacao.usuarioLogado = usuarioLogado?.uid || '';
  
      const transacaoParaAdicionar: Transacao = { ...this.transacao, livroId, usuarioId }; 
      await this.transacaoService.adicionarTransacao(transacaoParaAdicionar);
     
      this.snackBar.open('Transacao Realizada com sucesso!', 'Fechar', {
        duration: 5000, // 5 segundos
      });
  
      this.resetForm();
    } catch (error) {
      console.error('Erro ao realizar transação:', error);
      this.snackBar.open('Erro ao realizar Transação!', 'Fechar', {
        duration: 5000, // 5 segundos
      });
    }
  }
  
  
  

  public resetForm() {
    this.transacao = {
      tipo: 'emprestimo',
      livroNome: '',
      usuarioNome: '',
      data: '',
      quantidadeLivros: 0,
      livroId: '',
      usuarioId: '',
      usuarioLogado: ''
    };
    this.livrosEncontrados = [];
    this.usuariosEncontrados = [];
  }

  public formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }

  public logout(): void {
    this.authService.logout();
  }
}






