import { Component, OnInit } from '@angular/core';
import { Reserva } from '../reserva';
import { ReservaService } from '../../servicos/reserva.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minhasreservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minhasreservas.component.html',
  styleUrl: './minhasreservas.component.scss'
})
export class MinhasreservasComponent implements OnInit {

  reservas: Reserva[] = [];

  constructor(private reservaServico: ReservaService){

  }


  ngOnInit(): void {
    this.obterReservaPorUsuario();
  }

  async obterReservaPorUsuario(){
    this.reservas = await this.reservaServico.exibirReservaUsuarioAtual();
  }




}
