import { Component } from '@angular/core';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private authService: AuthService){}

  logout():void{
    this.authService.logout();
  }
}
