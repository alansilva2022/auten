import { TestBed } from '@angular/core/testing';
import { ReservaService } from './reserva.service';
import { addDoc, collection, doc, Firestore, getDoc, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Reserva } from '../componentes/reserva';
import { Component, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Livro } from '../componentes/livro';
import { ReservaComponent } from '../componentes/reserva/reserva.component';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<app-reserva></app-reserva>',
  standalone: true,
  imports: [ReservaComponent]
})
export class AppComponent {}

@NgModule({
  imports: [
    provideFirebaseApp(() => initializeApp({
      apiKey: 'AIzaSyAUKmMzSc-uBwwm-s3HZua6ptlQSyN6vIg',
      authDomain: 'autent-5db11.firebaseapp.com',
      databaseURL: 'https://autent-5db11-default-rtdb.firebaseio.com',
      projectId: 'autent-5db11',
      storageBucket: 'autent-5db11.appspot.com',
      messagingSenderId: '1018635080099',
    })),
    provideAuth(() => getAuth())
  ]
})
export class AppModule {}

describe('ReservaService', () => {
  let reservaService: ReservaService;
  let firestore: Firestore;
  let authService: AuthService;
  let livroId: string;
  let reservaMock: Reserva;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp({
          apiKey: 'AIzaSyAUKmMzSc-uBwwm-s3HZua6ptlQSyN6vIg',
          authDomain: 'autent-5db11.firebaseapp.com',
          databaseURL: 'https://autent-5db11-default-rtdb.firebaseio.com',
          projectId: 'autent-5db11',
          storageBucket: 'autent-5db11.appspot.com',
          messagingSenderId: '1018635080099',
        })),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth())
      ],
      providers: [
        ReservaService,
        AuthService
      ]
    });
    reservaService = TestBed.inject(ReservaService);
    firestore = TestBed.inject(Firestore);
    authService = TestBed.inject(AuthService);
    const livroMock = {
      titulo: 'Livro de Teste',
      ano_lancamento: '2020',
      autor: 'Autor de Teste',
      isbn: '1234567890',
      editora: 'Editora de Teste',
      sinopse: 'Sinopse do livro de teste',
      quantidadeInicial: 10,
      quantidade: 10,
      data: '2020-01-01',
      rating: 0,
      totalRatings: 0,
      numRatings: 0
    };
    const livroRef = await addDoc(collection(firestore, 'livros'), livroMock);
    const livroId = livroRef.id;
    reservaMock  = {
    livroNome: livroMock.titulo,
    data: '2023-03-01',
    livroId: livroId,
    usuarioLogado: 'usuario-123'
  };
  });


 

  it('deve adicionar uma reserva com sucesso', async () => {
    try {
      const reservaId = await reservaService.adicionarReserva(reservaMock);
      const colecaoReservas = collection(firestore, 'reservas');
      const reservaRef = doc(colecaoReservas, reservaId);
      let reservaDoc = await getDoc(reservaRef);
      if (!reservaDoc.exists()) {
        await delay(1000); // aguardar 1 segundo
        reservaDoc = await getDoc(reservaRef);
      }
      if (!reservaDoc.exists()) {
        console.error('Reserva não foi adicionada');
        console.error(reservaMock);
        console.error(reservaRef);
        fail('Reserva não foi adicionada');
      } else {
        expect(reservaDoc.data()).toEqual(reservaMock);
      }
    } catch (error) {
      console.error(error);
      fail('Erro inesperado');
    }
  });


  it('deve recuperar as reservas do usuário atual', async () => {
    const user = await authService.obterUsuarioAtual();
    if (user) {
      const reservaMock: Reserva = {
        livroNome: 'Livro de Teste',
        data: '2023-03-01',
        livroId: livroId,
        usuarioLogado: user.uid
      };
      await reservaService.adicionarReserva(reservaMock);
      const reservas = await reservaService.exibirReservaUsuarioAtual();
      expect(reservas.length).toBeGreaterThan(0);
      expect(reservas[0].usuarioLogado).toBe(user.uid);
    } else {
      const reservas = await reservaService.exibirReservaUsuarioAtual();
      expect(reservas).toEqual([]);
    }
  });

  it('deve lançar um erro ao tentar adicionar uma reserva com livro não encontrado', async () => {
    const reserva: Reserva = {
      livroNome: 'Livro de Teste',
      data: '2023-03-01',
      livroId: 'livro-errado',
      usuarioLogado: 'usuario-123'
    };
    try {
      await reservaService.adicionarReserva(reserva);
      fail('Deveria ter lançado um erro');
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(`Livro '${reserva.livroId}' não encontrado`);
      } else {
        fail('Erro inesperado');
      }
    }
  });


});
