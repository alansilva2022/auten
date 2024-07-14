import { Comentario } from "./comentario";


export interface Livro {
    titulo: string;
    ano_lancamento: string;
    autor: string;
    isbn: string;
    editora: string;
    foto?: string; // foto como opcional
    sinopse: string;
    quantidade: number;
    data: string;
    comentarios?: Comentario[];
    id?: string;
    rating: number; // média das avaliações
    totalRatings?: number; // soma das avaliações
    numRatings?: number; // número de avaliações
  }