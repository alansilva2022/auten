import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from './componentes/admin/admin.component';
import { HomeComponent } from './componentes/home/home.component';
import { NaoautorizadoComponent } from './componentes/naoautorizado/naoautorizado.component';
import { RegistrousuarioComponent } from './componentes/registrousuario/registrousuario.component';
//import { LoginComponent } from './componentes/login/login.component';//
import { IndexComponent } from './componentes/index.adm/index.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,AdminComponent, HomeComponent, NaoautorizadoComponent, RegistrousuarioComponent, IndexComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'auten';
}
