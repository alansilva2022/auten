import { Component, OnInit, OnDestroy } from '@angular/core';
import { Livro } from '../livro';
import { LivroService } from '../../servicos/livro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pesquisarlivro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pesquisarlivro.component.html',
  styleUrls: ['./pesquisarlivro.component.scss']
})
export class PesquisarlivroComponent implements OnInit, OnDestroy {

  termoPesquisa: string = '';
  livros$: Observable<Livro[]> = new Observable(); //  para armazenar a lista de livros

  private PesquisaSubject = new Subject<string>(); //  para gerenciar o termo de pesquisa
  private cancelar_inscricao$ = new Subject<void>(); // para gerenciamento de memória

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit() {
    // carregar todos os livros inicialmente
    this.livros$ = this.livroService.relatorioLivro();

    // configurar o Subject para lidar com a pesquisa
    this.PesquisaSubject.pipe(
      debounceTime(300), // tempo para esperar antes de realizar a pesquisa
      distinctUntilChanged(), // evitar pesquisas repetidas para o mesmo termo
      switchMap(termo => termo ? this.livroService.pesquisarLivros(termo) : this.livroService.relatorioLivro()),
      takeUntil(this.cancelar_inscricao$)  // limpar a assinatura quando o componente for destruído
    ).subscribe(livros => {
      this.livros$ = of(livros);  // atualiza o Observable com os novos dados
    });
  }

  pesquisarLivros() {
    this.PesquisaSubject.next(this.termoPesquisa.trim().toLowerCase());
  }

  onInput() {
    if (!this.termoPesquisa) {
      this.PesquisaSubject.next('');
    }
  }

  exibirDetalhes(livroId: string) {
    this.router.navigate(['/detalhes-livro', livroId]);
  }

  ngOnDestroy() {
    this.cancelar_inscricao$.next();
    this.cancelar_inscricao$.complete();
  }
}




