import { Component, OnInit } from '@angular/core';
import { Livro } from '../livro';
import { LivroService } from '../../servicos/livro.service';
import { AuthService } from '../../servicos/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatoriolivro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatoriolivro.component.html',
  styleUrl: './relatoriolivro.component.scss'
})
export class RelatoriolivroComponent implements OnInit{

  livros: Livro[] = [];
  usuarioLogado: string = '';

  constructor(private livroServico: LivroService, private authService: AuthService) {
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
   }
 
 
  ngOnInit(): void {
    this.obterLivros();
  }

  async obterLivros() {
    try {
      this.livros= await this.livroServico.relatorioLivro();
    } catch (error) {
      console.error('Erro ao obter livros:', error);
    }
  }

  

}
