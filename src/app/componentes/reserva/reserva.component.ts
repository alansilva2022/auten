import { Component } from '@angular/core';
import { Reserva } from '../reserva';
import { Livro } from '../livro';
import { AuthService } from '../../servicos/auth.service';
import { ReservaService } from '../../servicos/reserva.service';
import { TransacaoService } from '../../servicos/transacao.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss']
})
export class ReservaComponent {

   
  
  usuarioLogado: string = '';
  
  reserva: Reserva = {
    livroNome: '',
    usuarioLogado: '',
    data: '',
  };

  livrosEncontrados: Livro[] = [];

  constructor(
    public authService: AuthService, 
    private reservaService: ReservaService, 
    private transacaoService: TransacaoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
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

  async realizarReserva() {
    try {
      if (!this.reserva.livroNome) {
        throw new Error('Nome do livro é obrigatório');
      }

      const livro = await this.transacaoService.obterLivroPorNome(this.reserva.livroNome);
      const livroId = livro.id;
      const tituloCompleto = livro.titulo;

      this.reserva.livroNome = tituloCompleto;
      this.reserva.data = formatarData(new Date());
      const usuarioLogado = await this.transacaoService.obterUsuarioAtual();

      this.reserva.usuarioLogado = usuarioLogado;


      const reservaParaAdicionar: Reserva = { ...this.reserva, livroId }; 
      await this.reservaService.adicionarReserva(reservaParaAdicionar);
      this.snackBar.open('Reserva realizado com sucesso!', 'Fechar', {
        duration: 5000, // 5 segundos
      });

      this.resetForm();
      this.router.navigate(['/home']); 
    } catch (error) {
      console.error('Erro ao realizar reserva:', error);
    }
  }

  private resetForm() {
    this.reserva = {
      livroNome: '',
      data: '',
      usuarioLogado: '',
    };
    this.livrosEncontrados = [];
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

