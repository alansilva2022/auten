import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-classificacao-estrela',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './classificacao-estrela.component.html',
  styleUrl: './classificacao-estrela.component.scss'
})
export class ClassificacaoEstrelaComponent {

  @Input() rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
}
