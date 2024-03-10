import { Injectable, inject } from '@angular/core';
import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, doc, getDoc, getDocs, query, runTransaction, updateDoc, where } from '@angular/fire/firestore';
import { Transacao } from '../componentes/transacao';
import { Livro } from '../componentes/livro';
import { Usuario } from '../componentes/usuario';
import { AuthService } from './auth.service';
import { getAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  constructor(private authService: AuthService) { }

  firestore: Firestore = inject(Firestore);



  async obterUsuarioAtual(): Promise<string> {
    const usuarioAtual = await this.authService.obterUsuarioAtual();
    return usuarioAtual?.uid || '';
  }

  async adicionarTransacao(transacao: Transacao){
    const colecaotransacao = collection(this.firestore, 'transacoes');

    try{
      if(transacao.livroId){
        const livroRef = doc(this.firestore, 'livros', transacao.livroId);
        const livroResumo = await getDoc(livroRef);

        if(!livroResumo.exists()){
          throw new Error(`Livro '${transacao.livroId}' não encontrado`);      
        }
      }
      await runTransaction(this.firestore, async (transaction) => {

        /*
        A função runTransaction() pega na instância do Firestore e executa uma transação na base de dados.
         Esta função garante que o valor correto é atualizado.
        */
         
        if (transacao.livroId) {
          const livroRef = doc(this.firestore, 'livros', transacao.livroId);
          const livroDocSnapshot = await transaction.get(livroRef);

          if (livroDocSnapshot.exists()) {
            const livroData: any = livroDocSnapshot.data();
            const quantidadeAtualizada =
              transacao.tipo === 'emprestimo'
                ? livroData.quantidade - transacao.quantidadeLivros
                : livroData.quantidade + transacao.quantidadeLivros;

            transaction.update(livroRef, { quantidade: quantidadeAtualizada });
          }
        }

        const transacaoRef = await addDoc(colecaotransacao, transacao);

        console.log('Transação realizada com sucesso! ID:', transacaoRef.id);
      });

    
    } catch (error){
      console.error('Erro ao realizar transacao:', error);
        throw error;
    }
  }


  async obterUsuarioPorId(transaction: any, usuarioId: string): Promise<void> {
    const usuarioRef = doc(this.firestore, 'usuarios', usuarioId);  
    const usuarioDocSnapshot: DocumentSnapshot<DocumentData> = await transaction.get(usuarioRef);
    if (!usuarioDocSnapshot.exists()) {
      throw new Error(`Usuário '${usuarioId}' não encontrado`);
    }
  }

  
  async obterLivroPorId(transaction: any, livroId: string): Promise<void> {
    const livroRef = doc(this.firestore, 'livros', livroId);
    const livroDocSnapshot: DocumentSnapshot<DocumentData> = await transaction.get(
      livroRef
    );
    if (!livroDocSnapshot.exists()) {
      throw new Error(`Livro '${livroId}' não encontrado`);
    }
  }
  

  async obterLivroIdPorNome(nomeLivro: string): Promise<string> {
    const livroQuery = query(
      collection(this.firestore, 'livros'),
      where('titulo', '>=', nomeLivro),
      where('titulo', '<=', nomeLivro + '\uf8ff')
    );
    const livroSnapshot = await getDocs(livroQuery);

    if (!livroSnapshot.empty) {
      const livroDoc = livroSnapshot.docs[0];
      return livroDoc.id;
    } else {
      throw new Error(`Livro '${nomeLivro}' não encontrado`);
    }
  }

  async buscarLivrosPorNomeParcial(nomeLivro: string): Promise<Livro[]> {
    const livroQuery = query(
      collection(this.firestore, 'livros'),
      where('titulo', '>=', nomeLivro),
      where('titulo', '<=', nomeLivro + '\uf8ff')
    );
    const livroSnapshot = await getDocs(livroQuery);

    return livroSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as Livro,
    }));
  }

  async buscarUsuariosPorNomeParcial(nomeUsuario: string): Promise<Usuario[]> {
    const usuarioQuery = query(
      collection(this.firestore, 'usuarios'),
      where('nomeUsuario', '>=', nomeUsuario),
      where('nomeUsuario', '<=', nomeUsuario + '\uf8ff')
    );
    const usuarioSnapshot = await getDocs(usuarioQuery);

    return usuarioSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as Usuario,
    }));
  }

  async obterUsuarioIdPorNome(nomeUsuario: string): Promise<string> {
    const usuarioQuery = query(
      collection(this.firestore, 'usuarios'),
      where('nomeUsuario', '>=', nomeUsuario),
      where('nomeUsuario', '<=', nomeUsuario + '\uf8ff')
    );
    const usuarioSnapshot = await getDocs(usuarioQuery);

    if (!usuarioSnapshot.empty) {
      const usuarioDoc = usuarioSnapshot.docs[0];
      return usuarioDoc.id;
    } else {
      throw new Error(`Usuário '${nomeUsuario}' não encontrado`);
    }
  }

  async atualizarQuantidadeLivro(
    transaction: any,
    livroId: string,
    tipoTransacao: string,
    quantidadeTransacao: number
  ): Promise<void> {
    const livroRef = doc(this.firestore, 'livros', livroId);

    const livroDocSnapshot: DocumentSnapshot<DocumentData> = await transaction.get(
      livroRef
    );

    if (livroDocSnapshot.exists()) {
      const livroData: any = livroDocSnapshot.data();
      const quantidadeAtualizada =
        tipoTransacao === 'emprestimo'
          ? livroData.quantidade - quantidadeTransacao
          : livroData.quantidade + quantidadeTransacao;

      console.log('Quantidade Atualizada:', quantidadeAtualizada);
      console.log('livroId:', livroId);
      console.log('tipoTransacao:', tipoTransacao);
      console.log('quantidadeTransacao:', quantidadeTransacao);

      await updateDoc(livroRef, { quantidade: quantidadeAtualizada });
    }

  }

  
}
