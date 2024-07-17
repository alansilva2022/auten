import { Funcao } from "../funcao";

export interface Usuario {
   name: string;
   nomeUsuario: string;
   telefone: string;
   cpf: string;
   endereco: string;
   email: string;
   password: string;
   funcao: Funcao;
   id?: string;
}