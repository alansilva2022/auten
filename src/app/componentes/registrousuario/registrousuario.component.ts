import { Component } from '@angular/core';
import { Usuario } from '../usuario';
import { AuthService } from '../../servicos/auth.service';
import { FormsModule } from '@angular/forms';
import { Funcao } from '../../funcao';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrousuario',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './registrousuario.component.html',
  styleUrls: ['./registrousuario.component.scss']
})
export class RegistrousuarioComponent {
  email: string = '';
  password: string = '';

  usuarioLogado: string = '';
  
  usuario: Usuario = {
    name: '',
    email: '',
    password: '',
    funcao: Funcao.Usuario,
    nomeUsuario: '',
    telefone: '',
    cpf: '',
    endereco: ''
  };

  constructor(public authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
  }

  registrar() {
    if (!this.usuario.email || !this.usuario.password) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 5000, // 5 segundos
      });
      return;
    }

    if (!this.validateEmail(this.usuario.email)) {
      this.snackBar.open('Por favor, insira um e-mail válido.', 'Fechar', {
        duration: 5000, // 5 segundos
      });
      return;
    }

    const nomeUsuarioLogado = this.usuarioLogado;  // salvar nome usuario logado
    this.authService.registrarNovoUsuario(this.usuario.email, this.usuario.password, this.usuario)
      .then(() => {
        // limpar os campos
        this.usuario = {
          name: '',
          email: '',
          password: '',
          funcao: Funcao.Usuario,
          nomeUsuario: '',
          telefone: '',
          cpf: '',
          endereco: ''
        };
        this.snackBar.open('Cadastro usuário realizado com sucesso', 'Fechar', {
          duration: 5000, // 5 segundos
        });
        // restaurar o nome do usuário logado
        this.usuarioLogado = nomeUsuarioLogado;
        // redirecionar para a home do usuário logado
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.error('Erro ao registrar usuário:', error);
        this.snackBar.open('Erro ao cadastrar usuário', 'Fechar', {
          duration: 5000, // 5 segundos
        });
      });
  }

  cancelar() {
    this.authService.obterUsuarioAtual().then((usuarioAtual) => {
      if (usuarioAtual) {
        this.usuarioLogado = usuarioAtual.displayName || '';
        this.router.navigate(['/home']);
      }
    }).catch(error => {
      console.error('Erro ao obter usuário atual:', error);
    });
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  logout(): void {
    this.authService.logout();
  }
}












