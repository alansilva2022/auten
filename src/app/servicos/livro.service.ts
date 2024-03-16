import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, Query, QuerySnapshot, addDoc, collection, getDocs, query, where } from '@angular/fire/firestore';
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


  
 

  async pesquisarLivros(termo: string): Promise<Livro[]> {
    const livros: Livro[] = [];
    const livroColecao = collection(this.firestore, 'livros');

    let livrosQuery: Query<DocumentData> = livroColecao;

    if (termo) {
      // as consultas para título, autor e ISBN
      const tituloQuery = query(livroColecao, where('titulo', '>=', termo), where('titulo', '<=', termo + '\uf8ff'));
      const autorQuery = query(livroColecao, where('autor', '>=', termo), where('autor', '<=', termo + '\uf8ff'));
      const isbnQuery = query(livroColecao, where('isbn', '>=', termo), where('isbn', '<=', termo + '\uf8ff'));

      // os resultados de cada consulta
      const tituloResult = await this.executeQuery(tituloQuery);
      const autorResult = await this.executeQuery(autorQuery);
      const isbnResult = await this.executeQuery(isbnQuery);

      // Combinar os resultados em uma única lista
      livros.push(...tituloResult, ...autorResult, ...isbnResult);
    }

    return livros;
  }

  private async executeQuery(query: Query<DocumentData>): Promise<Livro[]> {
    const result: Livro[] = [];
    const querySnapshot = await getDocs(query);

    querySnapshot.forEach((doc) => {
      const livroData = doc.data();
      result.push({
        titulo: livroData['titulo'],
        ano_lancamento: livroData['ano_lancamento'],
        autor: livroData['autor'],
        isbn: livroData['isbn'],
        editora: livroData['editora'],
        foto: livroData['foto'],
        sinopse: livroData['sinopse'],
        quantidade: livroData['quantidade']
      });
    });

    return result;
  }

}



 
  

