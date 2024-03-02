import { Component } from '@angular/core';
import { Usuario } from '../usuario';
import { AuthService } from '../../servicos/auth.service';
import { FormsModule } from '@angular/forms';
import { Role } from '../../role';

@Component({
  selector: 'app-registrousuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrousuario.component.html',
  styleUrl: './registrousuario.component.scss'
})
export class RegistrousuarioComponent {

  email: string = '';
  password: string = '';
  
  usuario: Usuario = {
    name: '',
    email: '',
    password: '',
    role: Role.Usuario
  }
  constructor(private authService: AuthService){}

  registrar(){
    this.authService.registro(this.email, this.password, this.usuario);
  }
}
