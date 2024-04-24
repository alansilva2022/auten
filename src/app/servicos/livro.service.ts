import { Injectable, inject } from '@angular/core';
import { DocumentData, Firestore, Query, addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Livro } from '../componentes/livro';
import { Comentario } from '../componentes/comentario';
import { User } from 'firebase/auth';

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
      data: livro.data,
      rating: livro.rating
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
        data: livroData['data'],
        rating: livroData['rating']
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
        data: livroData['data'], 
        rating: livroData['rating'],
        foto: livroData['foto'],
      };
      livros.push(livro);
    });

    return livros;
  }


  adicionarComentario(usuario: User, livroId: string, texto: string): Promise<any> {
    const dataAtual = new Date();

    const comentario: Comentario = {
      userId: usuario.uid,
      texto: texto,
      data: formatarData(dataAtual),
      livroId: livroId
    };

    return addDoc(collection(this.firestore, 'comentarios'), comentario);
  }


  async adicionarRating(livroId: string, rating: number): Promise<void> {
    const livroRef = doc(this.firestore, 'livros', livroId);
    const livroSnapshot = await getDoc(livroRef);

    if (livroSnapshot.exists()) {
        const livroData = livroSnapshot.data() as Livro;
        
        if (livroData.rating !== undefined) { //verificando que o rating existe no documento do firestore
            const novoRating = (livroData.rating + rating) / 2; 

            await setDoc(livroRef, { ...livroData, rating: novoRating });
        } else {
            console.error('Campo de rating não encontrado no documento do livro.');
            throw new Error('Campo de rating não encontrado no documento do livro.');
        }
    } else {
        console.error('Livro não encontrado.');
        throw new Error('Livro não encontrado.');
    }
}



}



function formatarData(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Os meses começam do zero
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}


