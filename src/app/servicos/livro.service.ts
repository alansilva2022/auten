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
      quantidade: livro.quantidade,
      data: livro.data  //adicionado
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
      const tituloConsulta = query(livroColecao, where('titulo', '>=', termo), where('titulo', '<=', termo + '\uf8ff'));
      const autorConsulta = query(livroColecao, where('autor', '>=', termo), where('autor', '<=', termo + '\uf8ff'));
      const isbnConsulta = query(livroColecao, where('isbn', '>=', termo), where('isbn', '<=', termo + '\uf8ff'));

      // os resultados de cada consulta
      const tituloResultado = await this.efetuarConsulta(tituloConsulta);
      const autorResultado = await this.efetuarConsulta(autorConsulta);
      const isbnResultado = await this.efetuarConsulta(isbnConsulta);

      // Combinar os resultados em uma única lista
      livros.push(...tituloResultado, ...autorResultado, ...isbnResultado);
    }

    return livros;
  }

  private async efetuarConsulta(consulta: Query<DocumentData>): Promise<Livro[]> {
    const resultado: Livro[] = [];
    const consulta_instantanea = await getDocs(consulta);

     consulta_instantanea.forEach((doc) => {
      const livroData = doc.data();
      resultado.push({
        titulo: livroData['titulo'],
        ano_lancamento: livroData['ano_lancamento'],
        autor: livroData['autor'],
        isbn: livroData['isbn'],
        editora: livroData['editora'],
        foto: livroData['foto'],
        sinopse: livroData['sinopse'],
        quantidade: livroData['quantidade'],
        data: livroData['data'], //adicionado
      });
    });

    return resultado;
  }


  async relatorioLivro(): Promise<Livro[]> {
    const livroCollection = collection(this.firestore, 'livros');
    const livroSnapshot = await getDocs(livroCollection);

    const livros: Livro[] = [];

    livroSnapshot.forEach(doc => {
      const livroData = doc.data();
      const livro: Livro = {
        ano_lancamento: livroData['ano_lancamento'],
        titulo: livroData['titulo'],
        autor: livroData['autor'],
        isbn: livroData['isbn'],
        sinopse: livroData['sinopse'],
        editora: livroData['editora'],
        quantidade: livroData['quantidade'],
        data: livroData['data'], //adicionado
      };
      livros.push(livro);
    });

    return livros;
  }


}



 
  

