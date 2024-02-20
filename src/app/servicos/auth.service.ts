import { Injectable } from '@angular/core';
import { Role } from '../role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getUserRole(): Role{
    return Role.usuario;   // para verificar qual o papel -- na realidade será a chamada a API--se acessar o componente admin vai dar não autorizado
   // return Role.admin; // permite acessar ao componente admin
  }
}
