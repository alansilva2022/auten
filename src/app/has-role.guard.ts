import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Funcao } from './funcao';
import { AuthService } from './servicos/auth.service';

import { getAuth, onAuthStateChanged } from '@angular/fire/auth';



// função "hasRoleGuard" retorna uma promessa que resolve um booleano indicando se a navegação é permitida.

export const hasRoleGuard: CanActivateFn = async (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { //onAuthStateChanged verifica se o usuário está autenticado.
      if (!user) {
       // console.warn('Usuário não autenticado.');
        router.navigate(['naoautorizado']);
        resolve(false);
      } else {
        try {
          const funcao_usuario:Funcao = await authService.obter_funcao_usuario();
       //   console.log('Papel do usuário:', userRole);
       //   console.log('Informações do usuário:', auth.currentUser);

          const expectedRoles: Funcao[] = route.data['funcao'];

       //   console.log('Papéis esperados para a rota:', expectedRoles);

          const hasRole: boolean = expectedRoles.some((funcao) => funcao_usuario === funcao);  
          
          /* Na constante hasRole: verifica se o papel do usuário atual está entre os papéis permitidos para a rota.
           Utilizando o método some, ela retorna true se pelo menos um dos papéis esperados coincidir com o papel do usuário, e false caso contrário.
          */
          if (hasRole) {
            resolve(true);
          } else {
         //   console.warn('Usuário não tem permissão para acessar esta rota.');
            router.navigate(['naoautorizado']);
            resolve(false);
          }
        } catch (error) {
        //  console.error('Erro ao obter o papel do usuário:', error);
          router.navigate(['naoautorizado']);
          resolve(false);
        }
      }

      unsubscribe();
    });
  });
};

  





