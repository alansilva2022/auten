import { Component } from '@angular/core';
import { Reserva } from '../reserva';
import { Livro } from '../livro';
import { Usuario } from '../usuario';
import { AuthService } from '../../servicos/auth.service';
import { ReservaService } from '../../servicos/reserva.service';
import { TransacaoService } from '../../servicos/transacao.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss'
})
export class ReservaComponent {

  usuarioLogado: string = '';
  

  reserva: Reserva = {
      livroNome: '',
      usuarioLogado: '',
      data:'',
  };

  livrosEncontrados: Livro[] = [];
  

  constructor(public authService: AuthService, private reservaService: ReservaService, private transacaoService: TransacaoService){
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

  async realizarReserva() {
    try {
      const livroId = await this.transacaoService.obterLivroIdPorNome(this.reserva.livroNome);

      // Agora tem o livroId, pode continuar com a reserva
      const dataAtual = new Date();
      this.reserva.data = formatarData(dataAtual);


      const usuarioLogado = await this.transacaoService.obterUsuarioAtual();
      this.reserva.usuarioLogado = usuarioLogado;

      const reservaParaAdicionar: Reserva = { ...this.reserva, livroId}; 
      await this.reservaService.adicionarReserva(reservaParaAdicionar);
      
    

      // Limpar os campos após a transação ser realizada com sucesso
      this.reserva = {
        livroNome: '',
        data: '',
        usuarioLogado: '',

      };

      // Limpar os resultados da busca
      this.livrosEncontrados = [];

    } catch (error) {
      console.error('Erro ao realizar reserva:', error);
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
