import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Firestore, QueryDocumentSnapshot, addDoc, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Reserva } from '../componentes/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private authService: AuthService) { }

  firestore: Firestore = inject(Firestore);

  

  async adicionarReserva(reserva: Reserva){
    const colecaoreserva = collection(this.firestore, 'reservas');

    try{
      if(reserva.livroId){
        const livroRef = doc(this.firestore, 'livros', reserva.livroId);
        const livroResumo = await getDoc(livroRef);

        if(!livroResumo.exists()){
          throw new Error(`Livro '${reserva.livroId}' não encontrado`);      
        }
      }

        const reservaRef = await addDoc(colecaoreserva, reserva);

        console.log('Reserva realizada com sucesso! ID:', reservaRef.id);
      }
      catch (error){
      console.error('Erro ao realizar Reserva:', error);
        throw error;
    }
  }

  async exibirReservaUsuarioAtual(): Promise<Reserva[]> {
    const user = await this.authService.obterUsuarioAtual();
  
    if (user) {
      const consultarReserva = query(collection(this.firestore, 'reservas'), where('usuarioLogado', '==', user.uid));
      const capturaInstantanea = await getDocs(consultarReserva);
      return capturaInstantanea.docs.map((doc) => doc.data() as Reserva);
    } else {
      return [];
    }
  }
  

}
