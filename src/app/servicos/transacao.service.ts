import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, Firestore, addDoc, collection, doc, getDoc, getDocs, query, runTransaction, updateDoc, where } from '@angular/fire/firestore';
import { Transacao } from '../componentes/transacao';
import { Livro } from '../componentes/livro';
import { Usuario } from '../componentes/usuario';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  constructor(private authService: AuthService, private firestore: Firestore, private snackBar: MatSnackBar) { }

  async obterUsuarioAtual(): Promise<string> {
    const usuarioAtual = await this.authService.obterUsuarioAtual();
    return usuarioAtual?.uid || '';
  }

  async adicionarTransacao(transacao: Transacao) {
    const colecaotransacao = collection(this.firestore, 'transacoes');
  
    try {
      if (!transacao.livroId || !transacao.usuarioId) {
        throw new Error('IDs do livro ou do usuário não definidos.');
      }
  
      if (transacao.livroId) {
        const livroRef = doc(this.firestore, 'livros', transacao.livroId);
        const livroResumo = await getDoc(livroRef);
  
        if (!livroResumo.exists()) {
          throw new Error(`Livro '${transacao.livroId}' não encontrado`);
        }
      }
  
      await runTransaction(this.firestore, async (transaction) => {
        /*
        A função runTransaction() pega na instância do Firestore e executa uma transação na base de dados.
         Esta função garante que o valor correto é atualizado.
        */ 
        if (transacao.livroId) {
          const livroReferencia = doc(this.firestore, 'livros', transacao.livroId);
          const documento_livro= await transaction.get(livroReferencia);
  
          if (documento_livro.exists()) {
            const livroData: any = documento_livro.data();
            const quantidadeInicial = livroData.quantidadeInicial || 0;
            let novaQuantidade: number;
  
            if (transacao.tipo === 'emprestimo') {
              if (livroData.quantidade < transacao.quantidadeLivros) {
                throw new Error('Quantidade de livros insuficiente para empréstimo.');
              }
              novaQuantidade = livroData.quantidade - transacao.quantidadeLivros;
            } else if (transacao.tipo === 'devolucao') {
              novaQuantidade = Math.min(livroData.quantidade + transacao.quantidadeLivros, quantidadeInicial);
              if (livroData.quantidade >= quantidadeInicial) {
                throw new Error('A quantidade devolvida excede a quantidade inicial do livro.');
              }
            } else {
              throw new Error('Tipo de transação inválido.');
            }
  
            transaction.update(livroReferencia, { quantidade: novaQuantidade });
          }
        }
  
        const transacaoRef = await addDoc(colecaotransacao, transacao);
        console.log('Transação realizada com sucesso! ID:', transacaoRef.id);
      });
  
    } catch (error) {
      console.error('Erro ao realizar transação:', error);
      let errorMessage = 'Erro desconhecido ao realizar a transação.';
      if (error instanceof Error) {
        errorMessage = `Erro ao realizar transação: ${error.message}`;
      }
      this.snackBar.dismiss(); 
      this.snackBar.open(errorMessage, 'Fechar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
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
    const livroDocSnapshot: DocumentSnapshot<DocumentData> = await transaction.get(livroRef);
    if (!livroDocSnapshot.exists()) {
      throw new Error(`Livro '${livroId}' não encontrado`);
    }
  }

  async obterLivroPorNome(nomeLivro: string): Promise<{ id: string, titulo: string }> {
    const nome_Normalizado = nomeLivro.trim().toLowerCase();
    const livrosRef = collection(this.firestore, 'livros');
    const livroSnapshot = await getDocs(livrosRef);
  
    const livroDoc = livroSnapshot.docs.find(doc => {
      const dadosLivro = doc.data() as Livro;
      const tituloNormalizado = dadosLivro.titulo.trim().toLowerCase();
      return tituloNormalizado.includes(nome_Normalizado);
    });
  
    if (livroDoc) {
      const dadosLivro = livroDoc.data() as Livro;
      return { id: livroDoc.id, titulo: dadosLivro.titulo };
    } else {
      throw new Error(`Livro '${nomeLivro}' não encontrado`);
    }
  }
  

  async buscarLivrosPorNomeParcial(nomeLivro: string): Promise<Livro[]> {
    const termo_Normalizado = nomeLivro.trim().toLowerCase();
    const livroColecao = collection(this.firestore, 'livros');

    const livroSnapshot = await getDocs(livroColecao);

    const livros = livroSnapshot.docs.filter(doc => {
      const dadosLivro = doc.data() as Livro;
      const tituloNormalizado = dadosLivro.titulo.trim().toLowerCase();
      return tituloNormalizado.includes(termo_Normalizado);
    }).map(doc => ({
      id: doc.id,
      ...doc.data() as Livro,
    }));

    return livros;
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
    livroId: string,
    tipoTransacao: string,
    quantidadeTransacao: number
  ): Promise<void> {
    const livroRef = doc(this.firestore, 'livros', livroId);
    const livroDocSnapshot: DocumentSnapshot<DocumentData> = await getDoc(livroRef);
  
    if (livroDocSnapshot.exists()) {
      const livroData: any = livroDocSnapshot.data();
      const quantidadeAtualizada =
        tipoTransacao === 'emprestimo'
          ? livroData.quantidade - quantidadeTransacao
          : livroData.quantidade + quantidadeTransacao;
  
      // Garantindo que a quantidade não seja negativa e não passe do máximo cadastrado
      const quantidadeInicial = livroData.quantidadeInicial || 0;
      const quantidadeFinal = tipoTransacao === 'emprestimo'
        ? Math.max(quantidadeAtualizada, 0)
        : Math.min(quantidadeAtualizada, quantidadeInicial);
  
      console.log('Quantidade Atualizada:', quantidadeFinal);
      console.log('livroId:', livroId);
      console.log('tipoTransacao:', tipoTransacao);
      console.log('quantidadeTransacao:', quantidadeTransacao);
  
      await updateDoc(livroRef, { quantidade: quantidadeFinal });
    }
  }
  

  async consultarTransacoes(): Promise<Transacao[]> {
    const transacoesCollection = collection(this.firestore, 'transacoes');
    const transacoesSnapshot = await getDocs(transacoesCollection);

    const transacoes: Transacao[] = [];

    transacoesSnapshot.forEach(doc => {
      const transacaoData = doc.data();
      const transacao: Transacao = {
        tipo: transacaoData['tipo'],
        livroNome: transacaoData['livroNome'],
        usuarioNome: transacaoData['usuarioNome'],
        data: transacaoData['data'],
        quantidadeLivros: transacaoData['quantidadeLivros'],
        livroId: transacaoData['livroId'],
        usuarioId: transacaoData['usuarioId'],
        usuarioLogado: transacaoData['usuarioLogado']
      };
      transacoes.push(transacao);
    });

    return transacoes;
  }
}


