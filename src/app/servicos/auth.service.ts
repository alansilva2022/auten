import { Injectable, inject } from '@angular/core';
import { Role } from '../role';
import { Router } from '@angular/router';
import { Auth, authState, createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut} from '@angular/fire/auth'
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Usuario } from '../componentes/usuario';


@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  
  //firestore: Firestore = inject(Firestore);

  //authState$!: Observable<User | null>; //adicionado

 
  utilizadorAtual$ = authState(this.auth);  //obtenção do estado de autenticação e armazenando no utilizadorAtual
  
  constructor(private auth: Auth, private router: Router, private firestore: Firestore) {  }

 
  login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {
      console.log('sucesso ao realizar login');   
      this.router.navigate(['/home']);
    })
    .catch((error) => {
      console.error('Erro de fazer login:', error);
    })
  }


  // a ideia é fazer o cadastro (registro) do usuário tanto na coleção (Doc) quanto na autenticação.
  registro(email: string, password: string, usuario: Usuario){
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;  //obs.
      const novoUsuario: Usuario = { name: usuario.name, email: usuario.email, password: usuario.password, role: usuario.role};
      const usuarioCollection = collection(this.firestore, 'usuarios');

       
       return addDoc(usuarioCollection, novoUsuario).then(docRef => {
        
        console.log('Usuario cadastrado com sucesso! Documento ID:', docRef.id);
       
        this.router.navigate(['/login']); // está sendo redirecionado para página home porque está vazio
       
      })}).catch(error =>{
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
  
 /*

  //Obter o estado de autenticação
  getAuthState() {
    return this.authState$;
  }

  checkAuthState() {
    this.authState$.subscribe(user => {
      if (user) {
        // O usuário está autenticado, redirecione para a página inicial
        this.router.navigate(['/home']);
      } else {
        // O usuário não está autenticado, redirecione para a página de login
        this.router.navigate(['']); //login
      }
    });
  }

  */
 


  
  getUserRole(): Role{
    // return Role.usuario;   
   // verificar qual o papel -- na realidade será a chamada a API--se acessar o componente admin vai dar não autorizado
   // return Role.admin; // permite acessar ao componente adm (administrativo)

   return Role.admin;
  }
}
