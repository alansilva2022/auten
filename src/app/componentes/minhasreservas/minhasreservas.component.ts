import { Component, OnInit } from '@angular/core';
import { Reserva } from '../reserva';
import { ReservaService } from '../../servicos/reserva.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-minhasreservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minhasreservas.component.html',
  styleUrl: './minhasreservas.component.scss'
})
export class MinhasreservasComponent implements OnInit {

  reservas: Reserva[] = [];
  
  usuarioLogado: string = '';


  constructor(private reservaServico: ReservaService, private authService: AuthService){
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
  }


  ngOnInit(): void {
    this.obterReservaPorUsuario();
  }

  async obterReservaPorUsuario(){
    this.reservas = await this.reservaServico.exibirReservaUsuarioAtual();
  }




}
