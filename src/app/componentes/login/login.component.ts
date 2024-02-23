import { Component } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService){}

  login(): void{
      this.authService.login(this.email, this.password);
  }

}
