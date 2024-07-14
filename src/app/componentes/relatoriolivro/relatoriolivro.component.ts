import { Component, OnInit, OnDestroy } from '@angular/core';
import { Livro } from '../livro';
import { LivroService } from '../../servicos/livro.service';
import { AuthService } from '../../servicos/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-relatoriolivro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatoriolivro.component.html',
  styleUrls: ['./relatoriolivro.component.scss']
})
export class RelatoriolivroComponent implements OnInit, OnDestroy {

  livros$: Observable<Livro[]>; // para armazenar a lista de livros
  usuarioLogado: string = '';

  private cancelar_inscricao$= new Subject<void>();

  constructor(private livroService: LivroService, private authService: AuthService) {
    this.livros$ = this.livroService.relatorioLivro(); // inicializa o Observable
  }

  ngOnInit(): void {
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
  }

  ngOnDestroy(): void {
    this.cancelar_inscricao$.next();
    this.cancelar_inscricao$.complete();
  }

  logout(): void {
    this.authService.logout();
  }

}
