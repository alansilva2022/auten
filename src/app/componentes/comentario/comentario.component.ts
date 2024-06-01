import { Component } from '@angular/core';
import { Livro } from '../livro';
import { User } from 'firebase/auth';
import { LivroService } from '../../servicos/livro.service';
import { AuthService } from '../../servicos/auth.service';
import { TransacaoService } from '../../servicos/transacao.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.scss'
})
export class ComentarioComponent {
  
  termoPesquisa: string = '';
  livrosEncontrados: Livro[] = [];
  usuarioAtual: User | null = null;
  textoComentario: string = '';
  usuarioLogado: string = '';

  estrelasSelecionadas: number = 0;


 
  constructor(private livroService: LivroService, public authService: AuthService, private transacaoService: TransacaoService) {
    this.authService.obterNomeUsuario().then(async (nomeUsuario) => {
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
      const livros: Livro[] = await this.transacaoService.buscarLivrosPorNomeParcial(nomeLivro);
      this.livrosEncontrados = livros.map(livro => {
        return {
          ...livro,
          id: livro.id as string
        };
      });
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

   
  logout():void{
    this.authService.logout();
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

}


