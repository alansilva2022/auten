import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Role } from './role';
import { AuthService } from './servicos/auth.service';

import { getAuth, onAuthStateChanged } from '@angular/fire/auth';




export const hasRoleGuard: CanActivateFn = async (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn('Usuário não autenticado.');
        router.navigate(['naoautorizado']);
        resolve(false);
      } else {
        try {
          const userRole: Role = await authService.getUserRole();
          console.log('Papel do usuário:', userRole);
          console.log('Informações do usuário:', auth.currentUser);

          const expectedRoles: Role[] = route.data['roles'];

          console.log('Papéis esperados para a rota:', expectedRoles);

          const hasRole: boolean = expectedRoles.some((role) => userRole === role);

          if (hasRole) {
            resolve(true);
          } else {
            console.warn('Usuário não tem permissão para acessar esta rota.');
            router.navigate(['naoautorizado']);
            resolve(false);
          }
        } catch (error) {
          console.error('Erro ao obter o papel do usuário:', error);
          router.navigate(['naoautorizado']);
          resolve(false);
        }
      }

      unsubscribe();
    });
  });
};

  





