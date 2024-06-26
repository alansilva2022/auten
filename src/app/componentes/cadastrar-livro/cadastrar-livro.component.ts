import { Component, inject } from '@angular/core';
import { Livro } from '../livro';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { LivroService } from '../../servicos/livro.service';
import { UploadFotoService } from '../../servicos/upload-foto.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicos/auth.service';

@Component({
  selector: 'app-cadastrar-livro',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './cadastrar-livro.component.html',
  styleUrl: './cadastrar-livro.component.scss'
})
export class CadastrarLivroComponent {


  usuarioLogado: string = '';


  livroTitulo: string = '';
  livroAno: string = '';
  livroAutor: string = '';
  livroIsbn: string = '';
  livroEditora: string = '';
  livroSinopse: string = '';
  livroQuantidade!: number;
  livroData: string = ''; 
  livroRating!: number;

  livro: Livro = {
     titulo: '', 
     ano_lancamento: '',
     autor: '', 
     isbn: '', 
     editora: '', 
     sinopse: '', 
     quantidade: 0, 
     foto: '',
     data: '', 
     rating: 0,
    };


  livro$!: Observable<Livro[]>;

  firestore: Firestore = inject(Firestore);

  constructor(private livroServico: LivroService, private uploadFoto: UploadFotoService, public authService: AuthService){
      const livroColecao = collection(this.firestore, 'livros');
      const consultaLivros = query(livroColecao);
      this.livro$ = collectionData(consultaLivros) as Observable<Livro[]>;

      this.authService.obterNomeUsuario().then((nomeUsuario) => {
        this.usuarioLogado = nomeUsuario;
      });
  }


  logout():void{
    this.authService.logout();

  }



  adicionarLivro(){
    this.livro.foto = '';
    this.livro.data = ''; //adicionado

    console.log("Adicionando Livro", this.livro);

  
  }

  carregamento_de_foto(event: any){
    this.uploadFoto.uploadFoto(event.target.files[0], 'fotos/livro/').subscribe(async (url: string)=>{
      this.livro.foto = url;

      const dataAtual = new Date();  //adicionado
      this.livro.data = formatarData(dataAtual); //adicionado

      console.log("Carregamento de Foto - NovoLivro:", this.livro);
      
      const novoLivro: Livro = {
          titulo: this.livroTitulo,  
          ano_lancamento: this.livroAno, 
          autor: this.livroAutor, 
          isbn: this.livroIsbn, 
          editora: this.livroEditora, 
          sinopse: this.livroSinopse, 
          quantidade: this.livroQuantidade, 
          foto: this.livro.foto,
          data: this.livro.data,
          rating: this.livro.rating
        };
      
      await this.livroServico.adicionarLivro(novoLivro);
      console.log("Livro adicionado com sucesso", novoLivro);

      this.livroTitulo = '';
      this.livroQuantidade = 0;
      this.livro.foto = '';
      this.livroAno = '';
      this.livroAutor = '';
      this.livroIsbn = '';
      this.livroEditora = '';
      this.livroSinopse = '';
      this.livroData = ''; 
      this.livroRating = 0;
      
    });
  }
}

function formatarData(data: Date): string {
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Os meses começam do zero
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');
  const segundos = data.getSeconds().toString().padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

