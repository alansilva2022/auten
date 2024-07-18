import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from './componentes/admin/admin.component';
import { HomeComponent } from './componentes/home/home.component';
import { NaoautorizadoComponent } from './componentes/naoautorizado/naoautorizado.component';
import { RegistrousuarioComponent } from './componentes/registrousuario/registrousuario.component';
import { LoginComponent } from './componentes/login/login.component';
import { LoaderComponent } from './componentes/loader/loader.component';
import { LoadingService } from './servicos/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    AdminComponent, 
    HomeComponent, 
    NaoautorizadoComponent, 
    RegistrousuarioComponent, 
    LoginComponent, 
    LoaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'auten';
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
}

