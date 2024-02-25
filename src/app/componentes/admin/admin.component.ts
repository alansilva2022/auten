import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {


  constructor(public authService: AuthService ){}

  user$ = this.authService.utilizadorAtual$; //para ver o email logado

  ngOnInit(): void {
    
  }

}
