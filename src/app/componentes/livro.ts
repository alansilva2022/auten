import { Comentario } from "./comentario";


export interface Livro {
    titulo: string;
    ano_lancamento: string;
    autor: string;
    isbn: string;
    editora: string;
    foto?: string;
    sinopse: string;
    quantidade: number;
    data: string; 
    comentarios?: Comentario[];  //adicionado
    id?: string; //adicionado
    rating: 0; // adicionado
}
