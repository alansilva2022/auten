import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Livro } from '../componentes/livro';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  firestore: Firestore = inject(Firestore);

  constructor() { }

  adicionarLivro(livro: Livro){
    const novoLivro: Livro = {
      titulo: livro.titulo,
      ano_lancamento: livro.ano_lancamento,
      autor: livro.autor,
      isbn: livro.isbn,
      editora: livro.editora,
      foto: livro.foto,
      sinopse: livro.sinopse,
      quantidade: livro.quantidade
    }
    const livroColecao = collection(this.firestore, 'livros');
    return addDoc(livroColecao, novoLivro).then(docRef => {
      console.log('Livro adicionado com sucesso!, Documento ID:', docRef.id);
    }).catch(error => {
      console.error('Erro ao adicionar livro', error);
    });
  }
  
}
