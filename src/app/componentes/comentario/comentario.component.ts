import { Component, OnDestroy } from '@angular/core';
import { Livro } from '../livro';
import { User } from 'firebase/auth';
import { LivroService } from '../../servicos/livro.service';
import { AuthService } from '../../servicos/auth.service';
import { TransacaoService } from '../../servicos/transacao.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.scss'] // Correção do nome de 'styleUrl' para 'styleUrls'
})
export class ComentarioComponent implements OnDestroy {
  
  termoPesquisa: string = '';
  livrosEncontrados: Livro[] = [];
  usuarioAtual: User | null = null;
  textoComentario: string = '';
  usuarioLogado: string = '';
  estrelasSelecionadas: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(private livroService: LivroService, public authService: AuthService, private transacaoService: TransacaoService) { 
   
    const nomeUsuarioPromise = this.authService.obterNomeUsuario().then(async (nomeUsuario) => {
      if (nomeUsuario) {
        this.usuarioLogado = nomeUsuario;
        this.usuarioAtual = await this.authService.obterUsuarioAtual();
      } else {
        console.error('Usuário não autenticado');
      }
    }).catch(error => {
      console.error('Erro ao obter nome de usuário:', error);
    });

    
  }

  async buscarLivros(nomeLivro: string) {
    if (nomeLivro.trim() !== '') {
      this.livrosEncontrados = await this.transacaoService.buscarLivrosPorNomeParcial(nomeLivro);
    } else {
      this.livrosEncontrados = [];
    }
  }

  async classificarLivro(livroId: string, rating: number) {
    try {
      await this.livroService.adicionarRating(livroId, rating);
      this.estrelasSelecionadas = rating;
      console.log('Livro classificado com sucesso!');
    } catch (error) {
      console.error('Erro ao classificar o livro:', error);
    }
  }

  async adicionarComentario(livro: Livro) {
    if (!this.usuarioAtual) {
      console.error('Usuário não autenticado');
      return;
    }
  
    if (!this.textoComentario) {
      console.error('O texto do comentário é obrigatório');
      return;
    }
  
    try {
      if (livro.id) {
        await this.livroService.adicionarComentario(this.usuarioAtual, livro.id, this.textoComentario);
        console.log('Comentário adicionado com sucesso');
        this.textoComentario = '';
      } else {
        console.error('ID do livro não definido');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário', error);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.authService.logout();
  }
}




