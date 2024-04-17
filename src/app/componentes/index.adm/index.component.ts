import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-index.admin',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],      //Para usar *ngIf é preciso importar CommonModule
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

}