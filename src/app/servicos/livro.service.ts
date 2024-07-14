import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Livro } from '../componentes/livro';
import { Comentario } from '../componentes/comentario';
import { User } from 'firebase/auth';
import { Observable, Subject, from } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LivroService implements OnDestroy {

  private cancelar_inscricao$ = new Subject<void>();
  firestore: Firestore = inject(Firestore);

  constructor() { }

  ngOnDestroy(): void {
    this.cancelar_inscricao$.next();
    this.cancelar_inscricao$.complete();
  }

  adicionarLivro(livro: Livro): Promise<void> {
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
      rating: livro.rating || 0,
      totalRatings: livro.totalRatings,
      numRatings: livro.numRatings
    };

    const livroColecao = collection(this.firestore, 'livros');

    return addDoc(livroColecao, novoLivro).then(docRef => {
      console.log('Livro adicionado com sucesso!, Documento ID:', docRef.id);
    }).catch(error => {
      console.error('Erro ao adicionar livro', error);
    });
  }

  relatorioLivro(): Observable<Livro[]> {
    const livroColecao = collection(this.firestore, 'livros');
    const q = query(livroColecao);
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Livro
      }))),
      takeUntil(this.cancelar_inscricao$)  // garante a limpeza ao destruir o serviço
    );
  }

  pesquisarLivros(termo: string): Observable<Livro[]> {
    const livroColecao = collection(this.firestore, 'livros');
    const termo_Normalizado = termo.trim().toLowerCase();
    const q = query(livroColecao);

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs
        .filter(doc => {
          const dados_livros = doc.data() as Livro;
          return dados_livros.titulo.toLowerCase().includes(termo_Normalizado) ||
                 dados_livros.autor.toLowerCase().includes(termo_Normalizado) ||
                 dados_livros.isbn.toLowerCase().includes(termo_Normalizado);
        })
        .map(doc => ({
          id: doc.id,
          ...doc.data() as Livro
        }))
      ),
      takeUntil(this.cancelar_inscricao$)  // garante a limpeza ao destruir o serviço
    );
  }

  adicionarComentario(usuario: User, livroId: string, texto: string): Promise<void> {
    const dataAtual = new Date();
    const comentario: Comentario = {
      userId: usuario.uid,
      texto: texto,
      data: formatarData(dataAtual),
      livroId: livroId
    };
    return addDoc(collection(this.firestore, 'comentarios'), comentario)
      .then(() => Promise.resolve())  // ignora o DocumentReference e resolve o Promise
      .catch(error => {
        console.error('Erro ao adicionar comentário', error);
        return Promise.reject(error);  // propaga o erro, caso ocorra
      });
  }

  async adicionarRating(livroId: string, rating: number): Promise<void> {
    const livroRef = doc(this.firestore, 'livros', livroId);
    const captura_estado_livro = await getDoc(livroRef);
  
    if (captura_estado_livro.exists()) {
      const livroData = captura_estado_livro.data() as Livro;
  
      // obter a soma das avaliações e o número total de avaliações
      const somaAvaliacoes = (livroData.totalRatings || 0) + rating;
      const totalAvaliacoes = (livroData.numRatings || 0) + 1;
  
      // calcula a nova média de avaliações
      const novoRating = somaAvaliacoes / totalAvaliacoes;
  
      // atualiza o documento no firebase com a nova média e o número total de avaliações
      await setDoc(livroRef, {
        ...livroData,
        rating: novoRating,
        totalRatings: somaAvaliacoes,
        numRatings: totalAvaliacoes
      });
    } else {
      console.error('Livro não encontrado.');
      throw new Error('Livro não encontrado.');
    }
  }
  

  async obterLivroPorId(livroId: string): Promise<Livro | null> {
    const livro_documento = doc(this.firestore, 'livros', livroId);
    const livro_captura = await getDoc(livro_documento);

    if (livro_captura.exists()) {
      const livroData = livro_captura.data() as Livro;
      livroData.id = livro_captura.id;  // Adiciona o id do livro aos dados

      // carregar comentários do livro
      const comentariosQuery = query(collection(this.firestore, 'comentarios'), where('livroId', '==', livroId));
      const comentarios_Captura = await getDocs(comentariosQuery);
      const comentarios: Comentario[] = [];
      comentarios_Captura.forEach(comentarioDoc => {
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
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); 
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}



