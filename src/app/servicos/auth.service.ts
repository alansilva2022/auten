import { Injectable} from '@angular/core';
import { Role } from '../role';
import { Router } from '@angular/router';
import { Auth, User, authState, createUserWithEmailAndPassword,getAuth,onAuthStateChanged,signInWithEmailAndPassword, signOut, updateProfile} from '@angular/fire/auth'
import { Firestore} from '@angular/fire/firestore';
import { Usuario } from '../componentes/usuario';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  

  db = getFirestore(); 

  private currentUserSubject = new BehaviorSubject<User | null>(null);


 
  utilizadorAtual$ = authState(this.auth);  //obtenção do estado de autenticação e armazenando no utilizadorAtual
  

  /*constructor vai lidar com o estado de autenticação do usuario, obtendo o perfil do usuario e verificando se o mesmo estado com o papel definido (admin/usuario) 
  para acessar as rotas*/
  constructor(private auth: Auth, private router: Router, private firestore: Firestore) { 

    const aut = getAuth();
    
    // "onAuthStateChanged" - faz o monitoramento nas mudanças no estado de autenticação do usuário
    onAuthStateChanged(aut, async (user: User | null) => {
      if (user) {
        try {
          const userRole = await this.getUserRole();
       //   console.log('Papel do usuário:', userRole);

          if (userRole) {
          } else {
       //     console.error('Papel do usuário não encontrado.');
            this.router.navigate(['/naoautorizado']);
          }
        } catch (error) {
       //   console.error('Erro ao obter o papel do usuário:', error);
          this.router.navigate(['/naoautorizado']);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    });

   }

 
  login(email: string, password: string){
    
    return signInWithEmailAndPassword(this.auth, email, password) //signInWithEmailAndPassword: autentica o usuário com email e senha.
    .then(async () => {

      const user = this.auth.currentUser;

      if (user && user.displayName) {
        // Configure o nome do usuário no Firebase
        await updateProfile(user, {               //updateProfile: atualiza o perfil do usuário autenticado.
          displayName: user.displayName
        });
      }
      
        console.log('sucesso ao realizar login');   
     // console.log('Usuário autenticado:', this.auth.currentUser);
      this.router.navigate(['/home']);                //redireciona o usuário para a página inicial após o login bem-sucedido.
    })
    .catch((error) => {
      console.error('Erro de fazer login:', error);
    })
  }


  
  // a ideia é fazer o cadastro (registro) do usuário tanto na coleção (Doc) quanto na autenticação. OK!
  registro(email: string, password: string, usuario: Usuario){
    return createUserWithEmailAndPassword(this.auth, email, password)  //createUserWithEmailAndPassword: Cria um novo usuário com email e senha.
    .then(async (userCredential) => {
      const user = userCredential.user;  
      

      await updateProfile(user, {      //updateProfile: atualiza o perfil do usuário criado recentemente.
        displayName: usuario.nomeUsuario
      });

      const novoUsuario: Usuario = { name: usuario.name, 
                                    email: usuario.email, 
                                    password: usuario.password, 
                                    role: usuario.role, 
                                    nomeUsuario: usuario.nomeUsuario,
                                    telefone: usuario.telefone, 
                                    endereco: usuario.endereco, 
                                    cpf: usuario.cpf
      };

      const ref = doc(this.db, "usuarios", userCredential.user.uid); // criando uma referência direta a um documento no Firestore associado ao usuário autenticado. Isso é útil quando você deseja armazenar informações adicionais do usuário no Firestore ou recuperar informações específicas relacionadas ao usuário.
      
      await setDoc(ref, novoUsuario);   // setDoc está cadastrando usuário  - salva os dados do usuário no Firestore

      //console.log('Usuario cadastrado com sucesso!');
       

      const usuarioAtual = await this.obterUsuarioAtual();  //espera a conclusão da função obterUsuarioAtual e obtém o usuário atual.

       if (!usuarioAtual) {       
        this.currentUserSubject.next(user); //atualiza o BehaviorSubject com o novo usuário, notificando todos os assinantes sobre a mudança no estado de autenticação.
      }
       
     }).catch(error =>{
        console.error('Erro ao cadastrar usuario', error);
       });
  }
  

  logout(){
    return signOut(this.auth).then(() =>{
      this.router.navigate(['/pesquisarlivro']); 
    }).catch((error) =>{
      console.error('Erro durante logout', error);
    })
  }
  
 

  public async getUserRole(): Promise<Role> {    //getUserRole: obtém o papel do usuário autenticado a partir do Firestore
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const uid = user.uid;
  
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'usuarios', uid);
  
      try {
        const docSnapshot = await getDoc(userDocRef);  //getDoc: recupera o documento do usuário no Firestore.
        if (docSnapshot.exists()) {         //docSnapshot.exists(): verifica se o documento do usuário existe.
          const userRole = docSnapshot.data()['role'] as Role;
          this.currentUserSubject.next(user);  //atualiza o estado do BehaviorSubject com o usuário atual.
                                               //BehaviorSubject é usado para manter e distribuir o estado atual do usuário autenticado.
          return userRole;
        } else {
          console.error('Documento de usuário não encontrado no Firestore.');
          return Role.Usuario; 
        }
      } catch (error) {
        console.error('Erro ao obter o papel do usuário no Firestore:', error);
        return Role.Usuario; 
      }
    } else {
      console.error('Usuário não autenticado.');
      return Role.Usuario; 
    }
  }


  public async obterUsuarioAtual(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const aut = getAuth();
      onAuthStateChanged(aut, (user: User | null) => {  //monitora mudanças no estado de autenticação e resolve a Promise com o usuário atual
        console.log('Usuário atual retornado:', user); // verificar o usuário atual
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }

  async obterNomeUsuario(): Promise<string> {   //retorna o nome do usuário autenticado ou uma string vazia se o usuário não estiver autenticado.
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      return user.displayName || '';
    } else {
    //  console.log('Usuário não autenticado.');
      return '';
    }
  }

}