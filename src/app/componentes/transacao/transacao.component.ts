import { Component } from '@angular/core';
import { Transacao } from '../transacao';
import { TransacaoService } from '../../servicos/transacao.service';
import { Usuario } from '../usuario';
import { Livro } from '../livro';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transacao',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './transacao.component.html',
  styleUrl: './transacao.component.scss'
})
export class TransacaoComponent {

    
  transacao: Transacao = {
    tipo: 'emprestimo',
    livroNome: '',
    usuarioNome: '',
    data: '',
    quantidadeLivros: 0,
    usuarioId: ''
  };

  livrosEncontrados: Livro[] = [];
  usuariosEncontrados: Usuario[] = [];

  constructor(private transacaoService: TransacaoService) {}

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
      const livroId = await this.transacaoService.obterLivroIdPorNome(this.transacao.livroNome);
      const usuarioId = await this.transacaoService.obterUsuarioIdPorNome(this.transacao.usuarioNome);

      // Agora tem o livroId e usuarioId, você pode continuar com a transação
      const dataAtual = new Date();
      this.transacao.data = formatarData(dataAtual);
      const transacaoParaAdicionar: Transacao = { ...this.transacao, livroId, usuarioId }; 
      await this.transacaoService.adicionarTransacao(transacaoParaAdicionar);

      // Limpar os campos após a transação ser realizada com sucesso
      this.transacao = {
        livroNome: '',
        usuarioNome: '',
        data: '',
        quantidadeLivros: 0,
        usuarioId: '',
        tipo: 'emprestimo'
      };

      // Limpar os resultados da busca
      this.livrosEncontrados = [];
      this.usuariosEncontrados = [];

    } catch (error) {
      console.error('Erro ao realizar transação:', error);
    }
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
