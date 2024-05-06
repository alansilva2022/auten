import { Component, OnInit } from '@angular/core';
import { Livro } from '../livro';
import { LivroService } from '../../servicos/livro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pesquisarlivro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pesquisarlivro.component.html',
  styleUrl: './pesquisarlivro.component.scss'
})
export class PesquisarlivroComponent implements OnInit {

  termoPesquisa: string = '';
  livros: Livro[] = [];

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit() {      
   
    this.carregarTodosLivros();
  }

  async carregarTodosLivros() {
   
     this.livros = await this.livroService.relatorioLivro();
  }

  async pesquisarLivros() {
    this.livros = await this.livroService.pesquisarLivros(this.termoPesquisa);
  }

  onInput() {   //quando o input estiber vazio, deve carregar todos os livros
    if (!this.termoPesquisa) {
      this.carregarTodosLivros();
    }
  }

  exibirDetalhes(livroId: string) {
    this.router.navigate(['/detalhes-livro', livroId]);
  }

}
