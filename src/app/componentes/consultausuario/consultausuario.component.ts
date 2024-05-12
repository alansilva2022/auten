import { Component } from '@angular/core';
import { UsuarioService } from '../../servicos/usuario.service';
import { AuthService } from '../../servicos/auth.service';
import { Usuario } from '../usuario';
import { Role } from '../../role';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultausuario',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './consultausuario.component.html',
  styleUrl: './consultausuario.component.scss'
})
export class ConsultausuarioComponent {

  usuarioLogado: string = '';


  usuario: Usuario = {
    name: '',
    nomeUsuario: '',
    telefone: '',
    cpf: '',
    endereco: '',
    email: '',
    password: '',
    role: Role.Usuario 
  };

  constructor(private usuarioServico: UsuarioService, public authService: AuthService ){
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
  }

  logout():void{
    this.authService.logout();

  }

  nomeEncontrados: Usuario[] = [];

  async buscarUsuarios(name: string) {
    if (name.trim() !== '') {
      this.nomeEncontrados = await this.usuarioServico.obterUsuarioPorNome(name);
      
    } else {
      this.nomeEncontrados = [];
    }
  }

}
