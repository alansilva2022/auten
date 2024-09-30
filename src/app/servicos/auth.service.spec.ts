import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Firestore} from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { Usuario } from '../componentes/usuario';
import { Funcao } from '../funcao';
import { Auth, getAuth, provideAuth } from '@angular/fire/auth';


describe('AuthService', () => {
  let service: AuthService;
  let firestore: Firestore;
  let auth: any;

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
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth())
    ],
    providers: [
      AuthService
    ]
      
    });
    service = TestBed.inject(AuthService);
    firestore = TestBed.inject(Firestore);
    auth = TestBed.inject(Auth);
  });


  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });
 

  it('deve fazer login com sucesso', async () => {
    const email = 'teste@teste.com';
    const password = 'teste123';
    try {
      await service.login(email, password);
      expect(service.utilizadorAtual$).toBeTruthy();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  });


  

  it('deve falhar ao fazer login', async () => {
    const email = 'teste@teste.com';
    const password = 'teste1234';
    try {
      await service.login(email, password);
      fail('Deveria ter falhado');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

 

  it('deve falhar ao registrar um novo usuário', async () => {
    const email = 'teste@teste.com';
    const password = 'teste1234';
    const usuario: Usuario = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'teste123',
      nomeUsuario: 'Teste',
      telefone: '1234567890',
      cpf: '12345678901',
      endereco: 'Rua Teste, 123',
      funcao: Funcao.Admin 
    };
    try {
      await service.registrarNovoUsuario(email, password, usuario);
      fail('Deveria ter falhado');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });


it('deve registrar um novo usuário com sucesso', async () => {
  const email = 'novo-usuario@teste.com';
  const password = 'teste123';
  const usuario: Usuario = {
    name: 'Novo Usuário',
    email: 'novo-usuario@teste.com',
    password: 'teste123',
    nomeUsuario: 'Novo Usuário',
    telefone: '1234567890',
    cpf: '12345678901',
    endereco: 'Rua Teste, 123',
    funcao: Funcao.Admin 
  };
  try {
    await service.registrarNovoUsuario(email, password, usuario);
    expect(service.utilizadorAtual$).toBeTruthy();
  } catch (error) {
    console.error('Erro ao registrar novo usuário:', error);
  }
});



  it('deve obter a função do usuário corretamente', async () => {
    const funcao = await service.obter_funcao_usuario();
    expect(funcao).toBeTruthy();
  });

 
  it('deve obter o usuário atual corretamente', async () => {
    await service.login('teste@teste.com', 'teste123');
    const usuario = await service.obterUsuarioAtual();
    expect(usuario).toBeTruthy();
    await service.logout();
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    const usuarioAtual = await service.obterUsuarioAtual();
    expect(usuarioAtual).toBeNull();
  });


  it('deve fazer logout com sucesso', async () => {
    await service.login('teste@teste.com', 'teste123');
    expect(service.utilizadorAtual$).toBeTruthy();
    await service.logout();
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    console.log('Usuário atual após logout:', service.utilizadorAtual$);
    service.utilizadorAtual$.subscribe(usuarioAtual => {
      console.log('Usuário atual após logout:', usuarioAtual);
      expect(usuarioAtual).toBeNull();
    });
  });
 
});
