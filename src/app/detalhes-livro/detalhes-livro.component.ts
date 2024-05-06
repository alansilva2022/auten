import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivroService } from '../servicos/livro.service';
import { Livro } from '../componentes/livro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhes-livro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalhes-livro.component.html',
  styleUrl: './detalhes-livro.component.scss'
})
export class DetalhesLivroComponent implements OnInit {

  livro: Livro | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private livroService: LivroService){}

  
  ngOnInit(): void {

    const livroId = this.route.snapshot.paramMap.get('id');
    if(livroId){
        this.carregardetalhesdolivro(livroId);
    }else{
        this.router.navigate(['/pesquisarlivro']);
    }
    
  }

  async carregardetalhesdolivro(livroId: string){
    try{
      this.livro = await this.livroService.obterLivroPorId(livroId);
      if(!this.livro){
        console.error('Livro não localizado na base de dados');
      }
    } catch(error){
      console.error('Erro ao carregar o livro selecionado: ', error);
    }
  }




}
