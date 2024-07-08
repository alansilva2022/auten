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
    const termo_Normalizado = termo.trim().toLowerCase();


    const livroSnapshot = await getDocs(livroColecao); //obtem todos os documentos da coleção "livros" sem aplicar filtros

    livroSnapshot.forEach(doc => {                //aplicando filtro
      const dados_livros = doc.data() as Livro;
      if (this.buscartermo(dados_livros, termo_Normalizado)) {
        livros.push({
          id: doc.id,
          ...dados_livros
        });
      }
    });

    return livros;
 }
 
 
 private buscartermo(livro: Livro, term: string): boolean {  //verifica se o termo de busca aparece em qualquer posição do campo 
  return livro.titulo.toLowerCase().includes(term) ||
         livro.autor.toLowerCase().includes(term) ||
         livro.isbn.toLowerCase().includes(term);
}




  async relatorioLivro(): Promise<Livro[]> {
    const livroCollection = collection(this.firestore, 'livros');
    const livroSnapshot = await getDocs(livroCollection);

    const livros: Livro[] = [];
    livroSnapshot.forEach(doc => {
      const livroData = doc.data() as Livro;
      livros.push({
        id: doc.id,
        ...livroData
      });
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

async obterLivroPorId(livroId: string): Promise<Livro | null> {
  const livroDoc = doc(this.firestore, 'livros', livroId);
  const livroSnap = await getDoc(livroDoc);

  if (livroSnap.exists()) {
    const livroData = livroSnap.data() as Livro;
   
    livroData.id = livroSnap.id;  // adicione o id do livro aos dados

    // Carregar comentários do livro
    const comentariosQuery = query(collection(this.firestore, 'comentarios'), where('livroId', '==', livroId));
    const comentariosSnap = await getDocs(comentariosQuery);
    const comentarios: Comentario[] = [];
    comentariosSnap.forEach(comentarioDoc => {
      comentarios.push(comentarioDoc.data() as Comentario);
    });
    livroData.comentarios = comentarios;

    
    return livroData;
  } else {
    return null;
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

