import { Component } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,  MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  errorMessage: string | null = null;
  

  constructor(private authService: AuthService, private snackBar: MatSnackBar){}

  login(): void{
    this.authService.login(this.email, this.password).then(() => {
      this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
        duration: 5000, // 5 segundos
      });
    }).catch(error => {
      this.snackBar.open('Erro ao fazer login: ' + error.message, 'Fechar', {
        duration: 5000, // 5 segundos
      });
    });
  }
}


