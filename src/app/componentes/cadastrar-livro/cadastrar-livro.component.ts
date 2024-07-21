import { Component, OnDestroy, inject } from '@angular/core';
import { Livro } from '../livro';
import { Observable, Subject } from 'rxjs';
import { Firestore, collection, collectionData, query } from '@angular/fire/firestore';
import { LivroService } from '../../servicos/livro.service';
import { UploadFotoService } from '../../servicos/upload-foto.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicos/auth.service';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-cadastrar-livro',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, MatSnackBarModule],
  templateUrl: './cadastrar-livro.component.html',
  styleUrls: ['./cadastrar-livro.component.scss']
})
export class CadastrarLivroComponent implements OnDestroy {

  usuarioLogado: string = '';
  private cancelar_inscricao$ = new Subject<void>();

  livroTitulo: string = '';
  livroAno: string = '';
  livroAutor: string = '';
  livroIsbn: string = '';
  livroEditora: string = '';
  livroSinopse: string = '';
  livroQuantidade!: number;
  livroData: string = ''; 
  livroRating: number = 0;  
  livroTotalRatings: number = 0; 
  livroNumRatings: number = 0; 

  livro: Livro = {
    titulo: '', 
    ano_lancamento: '',
    autor: '', 
    isbn: '', 
    editora: '', 
    sinopse: '', 
    quantidade: 0, 
    quantidadeInicial: 0, 
    foto: '',
    data: '', 
    rating: 0,
    totalRatings: 0,
    numRatings: 0
  };

  livro$!: Observable<Livro[]>;

  firestore: Firestore = inject(Firestore);

  constructor(private livroServico: LivroService, private uploadFoto: UploadFotoService, public authService: AuthService,  private snackBar: MatSnackBar) {
    const livroColecao = collection(this.firestore, 'livros');
    const consultaLivros = query(livroColecao);
    this.livro$ = collectionData(consultaLivros) as Observable<Livro[]>;

    this.authService.obterNomeUsuario().then((nomeUsuario) => {
      this.usuarioLogado = nomeUsuario;
    });
  }

  ngOnDestroy(): void {
    this.cancelar_inscricao$.next();
    this.cancelar_inscricao$.complete();
  }

  logout(): void {
    this.authService.logout();
  }

  async adicionarLivro() {
    if (!this.livro.foto) {
      this.snackBar.open('Por favor, carregue a foto do livro antes de cadastrar.', 'Fechar', {
        duration: 5000, // 5 segundos
      });
      return;
    }

    const novoLivro: Livro = {
      titulo: this.livroTitulo,
      ano_lancamento: this.livroAno,
      autor: this.livroAutor,
      isbn: this.livroIsbn,
      editora: this.livroEditora,
      sinopse: this.livroSinopse,
      quantidade: this.livroQuantidade,
      quantidadeInicial: this.livroQuantidade,
      foto: this.livro.foto,
      data: this.livro.data,
      rating: this.livroRating,  
      totalRatings: this.livroTotalRatings,
      numRatings: this.livroNumRatings
    };

    try {
      await this.livroServico.adicionarLivro(novoLivro);
      console.log("Livro adicionado com sucesso", novoLivro);
      this.snackBar.open('Livro cadastrado com sucesso!', 'Fechar', {
        duration: 5000, // 5 segundos
      });
      this.limparFormulario();
    } catch (error) {
      console.error('Erro ao adicionar livro', error);
      this.snackBar.open('Erro ao cadastrar o livro. Tente novamente.', 'Fechar', {
        duration: 5000, // 5 segundos
      });
    }
  }

  carregamento_de_foto(event: any) {
    this.uploadFoto.uploadFoto(event.target.files[0], 'fotos/livro/').pipe(
      takeUntil(this.cancelar_inscricao$)
    ).subscribe(async (url: string) => {
      this.livro.foto = url;
      this.livro.data = formatarData(new Date());

      console.log("Carregamento de Foto - URL da Foto:", this.livro.foto);
    });
  }

  private limparFormulario(): void {
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
    this.livroNumRatings = 0;
    this.livroTotalRatings = 0
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


