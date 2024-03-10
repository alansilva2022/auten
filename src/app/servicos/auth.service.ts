import { Injectable, inject } from '@angular/core';
import { Role } from '../role';
import { Router } from '@angular/router';
import { Auth, User, authState, createUserWithEmailAndPassword,getAuth,onAuthStateChanged,signInWithEmailAndPassword, signOut, updateProfile} from '@angular/fire/auth'
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Usuario } from '../componentes/usuario';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  

  db = getFirestore(); //ADICIONADO 28/02/2024 - 23:41

  private currentUserSubject = new BehaviorSubject<Role | null>(null);

 
  utilizadorAtual$ = authState(this.auth);  //obtenção do estado de autenticação e armazenando no utilizadorAtual
  
  constructor(private auth: Auth, private router: Router, private firestore: Firestore) { 

    const aut = getAuth();

    onAuthStateChanged(aut, async (user: User | null) => {
      if (user) {
        try {
          const userRole = await this.getUserRole();
          console.log('Papel do usuário:', userRole);

          if (userRole) {
           
          } else {
            console.error('Papel do usuário não encontrado.');
            this.router.navigate(['/naoautorizado']);
          }
        } catch (error) {
          console.error('Erro ao obter o papel do usuário:', error);
          this.router.navigate(['/naoautorizado']);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    });

   }

 
  login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password)
    .then(async () => {

      const user = this.auth.currentUser;

      if (user && user.displayName) {
        // Configure o nome do usuário no Firebase
        await updateProfile(user, {
          displayName: user.displayName
        });
      }
      
      console.log('sucesso ao realizar login');   
      console.log('Usuário autenticado:', this.auth.currentUser);
      this.router.navigate(['/home']);
    })
    .catch((error) => {
      console.error('Erro de fazer login:', error);
    })
  }

  
  // a ideia é fazer o cadastro (registro) do usuário tanto na coleção (Doc) quanto na autenticação. OK!
  registro(email: string, password: string, usuario: Usuario){
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;  //obs.


      await updateProfile(user, {
        displayName: usuario.nomeUsuario
      });

      const novoUsuario: Usuario = { name: usuario.name, email: usuario.email, password: usuario.password, role: usuario.role, nomeUsuario: usuario.nomeUsuario,
      telefone: usuario.telefone, endereco: usuario.endereco, cpf: usuario.cpf
      };

      const ref = doc(this.db, "usuarios", userCredential.user.uid); // Esta linha está criando uma referência direta a um documento no Firestore associado ao usuário autenticado. Isso é útil quando você deseja armazenar informações adicionais do usuário no Firestore ou recuperar informações específicas relacionadas ao usuário.
        

      return setDoc(ref, novoUsuario).then(docRef =>{   // setDoc está cadastrando usuário
        console.log('Usuario cadastrado com sucesso!');
        this.router.navigate(['/login']); 
      }

      )}).catch(error =>{
        console.error('Erro ao cadastrar usuario', error);
       })
  }
  

  logout(){
    return signOut(this.auth).then(() =>{
      this.router.navigate(['/login']); 
    }).catch((error) =>{
      console.error('Erro durante logout', error);
    })
  }
  
 

  public async getUserRole(): Promise<Role> {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      const uid = user.uid;
  
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'usuarios', uid);
  
      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userRole = docSnapshot.data()['role'] as Role;
          this.currentUserSubject.next(userRole);
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
      onAuthStateChanged(aut, (user: User | null) => {
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }

  async obterNomeUsuario(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      console.log('Nome do usuário obtido:', user.displayName);
      return user.displayName || '';
    } else {
      console.log('Usuário não autenticado.');
      return '';
    }
  }




}