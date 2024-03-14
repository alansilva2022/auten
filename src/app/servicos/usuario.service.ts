import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Usuario } from '../componentes/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor() { }

  firestore: Firestore = inject(Firestore);


  async obterUsuarioPorNome(name: string): Promise<Usuario[]> {
    const usuarioQuery = query(
      collection(this.firestore, 'usuarios'),
      where('nomeUsuario', '>=', name),
      where('nomeUsuario', '<=', name + '\uf8ff')
    );
    const usuarioSnapshot = await getDocs(usuarioQuery);
  
    return usuarioSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data() as Usuario,
    }));
  }

}
