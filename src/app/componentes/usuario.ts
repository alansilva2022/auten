import { Role } from "../role";

export interface Usuario {
   name: string;
   nomeUsuario: string;
   telefone: string;
   cpf: string;
   endereco: string;
   email: string;
   password: string;
   role: Role  
}