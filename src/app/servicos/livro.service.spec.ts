import { TestBed } from '@angular/core/testing';
import { LivroService } from './livro.service';
import { Firestore, collection, getDocs, query} from '@angular/fire/firestore';
import { Comentario } from '../componentes/comentario';
import { User } from 'firebase/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

describe('LivroService', () => {
  let service: LivroService;
  let firestore: Firestore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp({
          apiKey: 'AIzaSyAUKmMzSc-uBwwm-s3HZua6ptlQSyN6vIg',
          authDomain: 'autent-5db11.firebaseapp.com',
          databaseURL: 'https://autent-5db11-default-rtdb.firebaseio.com',
          projectId: 'autent-5db11',
          storageBucket: 'autent-5db11.appspot.com',
          messagingSenderId: '1018635080099',
        })),
        provideFirestore(() => getFirestore())
      ],
      providers: [
        LivroService
      ]
    });
    service = TestBed.inject(LivroService);
    firestore = TestBed.inject(Firestore);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve adicionar um novo comentário', async () => {
    const usuario: User = {
      uid: '1234567890',
      email: 'teste@teste.com',
      displayName: 'Nome do usuário',
      phoneNumber: '1234567890',
      providerId: 'providerId',
      photoURL: 'https://example.com/foto.jpg',
      emailVerified: false,
      isAnonymous: false,
      metadata: {
        creationTime: '2022-01-01T00:00:00.000Z',
        lastSignInTime: '2022-01-01T00:00:00.000Z'
      },
      providerData: [
        {
          displayName: 'Nome do usuário',
          phoneNumber: '1234567890',
          photoURL: 'https://example.com/foto.jpg',
          providerId: 'providerId',
          email: 'teste@teste.com', 
          uid: '1234567890'
        }
      ],
      refreshToken: 'refreshToken',
      toJSON: () => ({}),
      tenantId: null,
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve(''),
      getIdTokenResult: () => Promise.resolve({
        token: '',
        authTime: '',
        expirationTime: '',
        issuedAtTime: '',
        signInProvider: '',
        signInSecondFactor: '',
        signInProviderId: '',
        claims: {}
      }),
      reload: () => Promise.resolve()
    };
  
    const comentario: Comentario = {
      userId: usuario.uid,
      texto: 'Comentário teste',
      data: '2022-01-01',
      livroId: '1234567890'
    };
  
    await service.adicionarComentario(usuario, comentario.livroId, comentario.texto);
    const comentarioColecao = collection(firestore, 'comentarios');
    const q = query(comentarioColecao);
    const snapshot = await getDocs(q);
    expect(snapshot.docs.length).toBeGreaterThan(0);
  });
});