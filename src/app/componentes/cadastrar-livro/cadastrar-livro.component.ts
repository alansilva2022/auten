import { Component, inject } from '@angular/core';
import { Livro } from '../livro';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { LivroService } from '../../servicos/livro.service';
import { UploadFotoService } from '../../servicos/upload-foto.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cadastrar-livro',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './cadastrar-livro.component.html',
  styleUrl: './cadastrar-livro.component.scss'
})
export class CadastrarLivroComponent {
  livroTitulo: string = '';
  livroAno: string = '';
  livroAutor: string = '';
  livroIsbn: string = '';
  livroEditora: string = '';
  livroSinopse: string = '';
  livroQuantidade!: number;

  livro: Livro = { titulo: '', ano_lancamento: '', autor: '', isbn: '', editora: '', sinopse: '', quantidade: 0, foto: ''};
  livro$!: Observable<Livro[]>;
  firestore: Firestore = inject(Firestore);

  constructor(private livroServico: LivroService, private uploadFoto: UploadFotoService){
      const livroColecao = collection(this.firestore, 'livros');
      const consultaLivros = query(livroColecao);
      this.livro$ = collectionData(consultaLivros) as Observable<Livro[]>;
  }

  adicionarLivro(){
    this.livro.foto = '';
    console.log("Adicionando Livro", this.livro);
  }

  carregamento_de_foto(event: any){
    this.uploadFoto.uploadFoto(event.target.files[0], 'fotos/livro/').subscribe(async (url: string)=>{
      this.livro.foto = url;
      console.log("Carregamento de Foto - NovoLivro:", this.livro);
      const novoLivro: Livro = {titulo: this.livroTitulo,  ano_lancamento: this.livroAno, autor: this.livroAutor, isbn: this.livroIsbn,  editora: this.livroEditora, sinopse: this.livroSinopse, quantidade: this.livroQuantidade, foto: this.livro.foto};
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
    });
  }
}
