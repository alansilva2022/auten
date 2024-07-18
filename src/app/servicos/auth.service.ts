import { Injectable, OnDestroy } from '@angular/core';
import { Funcao } from '../funcao';
import { Router } from '@angular/router';
import { Auth, User, authState, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Usuario } from '../componentes/usuario';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject, Subject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  db = getFirestore(); 
  private assunto_usuario_atual = new BehaviorSubject<User | null>(null);
  utilizadorAtual$ = authState(this.auth);
  private destruir$ = new Subject<void>();
  private cacheFuncaoUsuario: Funcao | null = null;

  constructor(private auth: Auth, private router: Router) { 
    const aut = getAuth();
    onAuthStateChanged(aut, async (user: User | null) => {
      if (user) {
        try {
          this.assunto_usuario_atual.next(user);
        } catch (error) {
          console.error('Erro ao obter o papel do usuário:', error);
        }
      } else {
        this.assunto_usuario_atual.next(null);
        this.cacheFuncaoUsuario = null;
      }
    });
  }

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then(async () => {
      const user = this.auth.currentUser;
      if (user && user.displayName) {
        await updateProfile(user, { displayName: user.displayName });
      }
      this.router.navigate(['/home']);
    })
    .catch((error) => {
      console.error('Erro de fazer login:', error);
      throw error;
    });
  }

  async registrarNovoUsuario(email: string, password: string, usuario: Usuario): Promise<void> {
    const authAtual = getAuth();
    const usuarioAtual = authAtual.currentUser;
    const senhaAtual = password; //armazenar senha

    try {
      
      const credencial_usuario = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = credencial_usuario.user;
  
      // atualizar usuário perfil
      await updateProfile(user, { displayName: usuario.nomeUsuario });
  
      
      const novoUsuario: Usuario = {
        name: usuario.name,
        email: usuario.email,
        password: usuario.password,
        funcao: usuario.funcao,
        nomeUsuario: usuario.nomeUsuario,
        telefone: usuario.telefone,
        endereco: usuario.endereco,
        cpf: usuario.cpf
      };
  
      const referencia = doc(this.db, "usuarios", user.uid);
      await setDoc(referencia, novoUsuario);
  
      // restaurar o estado de autenticação
      if (usuarioAtual) {
        await signInWithEmailAndPassword(this.auth, usuarioAtual.email as string, senhaAtual);
      }

    } catch (error) {
      console.error('Erro ao registrar novo usuário:', error);
      throw error;
    }
  }

  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/pesquisarlivro']); 
    }).catch((error) => {
      console.error('Erro durante logout', error);
    });
  }

  public async obter_funcao_usuario(): Promise<Funcao> {   
    
    if (this.cacheFuncaoUsuario) {
      return this.cacheFuncaoUsuario;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;

      const firestore = getFirestore();
      const documento_do_utilizador = doc(firestore, 'usuarios', uid);

      try {
        const resumo_documento = await getDoc(documento_do_utilizador);
        if (resumo_documento.exists()) {
          const funcao_usuario = resumo_documento.data()['funcao'] as Funcao;
          this.cacheFuncaoUsuario = funcao_usuario;
          return funcao_usuario;
        } else {
          console.error('Documento de usuário não encontrado no Firestore.');
          return Funcao.Usuario; 
        }
      } catch (error) {
        console.error('Erro ao obter o papel do usuário no Firestore:', error);
        return Funcao.Usuario; 
      }
    } else {
      return Funcao.Usuario; 
    }
  }

  public async verificarPermissao(funcaoPermitidas: Funcao[]): Promise<boolean> {
    const funcao_usuario = await this.obter_funcao_usuario();
    return funcaoPermitidas.includes(funcao_usuario);
  }

  public async obterUsuarioAtual(): Promise<User | null> {
    return firstValueFrom(this.utilizadorAtual$);
  }
 

  async obterNomeUsuario(): Promise<string> {
    const user = this.auth.currentUser;
    return user ? user.displayName || '' : '';
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}








