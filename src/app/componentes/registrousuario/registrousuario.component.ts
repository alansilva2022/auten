import { Component } from '@angular/core';
import { Usuario } from '../usuario';
import { AuthService } from '../../servicos/auth.service';
import { FormsModule } from '@angular/forms';
import { Role } from '../../role';
import { Router } from '@angular/router';

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
    role: Role.Usuario,
    nomeUsuario: '',
    telefone: '',
    cpf: '',
    endereco: ''
  }
  constructor(private authService: AuthService, private router: Router){}

  registrar() {
    this.authService.registro(this.email, this.password, this.usuario).then(() => {
      // Redirecionar o usuário para a página principal após o registro
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Erro ao registrar usuário:', error);
      // Em caso de erro ao registrar o usuário, não redirecionar o usuário para a página principal
    });
  }
  
  
}
