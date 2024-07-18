import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Funcao } from './funcao';
import { AuthService } from './servicos/auth.service';
import { LoadingService } from './servicos/loading.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const hasRoleGuard: CanActivateFn = async (route) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const loadingService: LoadingService = inject(LoadingService);

  loadingService.setLoading(true); // iniciar o estado de carregamento

  return new Promise<boolean>((resolve) => {
    const auth = getAuth();
    const cancelar_subscricao = onAuthStateChanged(auth, async (user) => {
      loadingService.setLoading(false); // Finalizar o estado de carregamento

      cancelar_subscricao(); // Cancelar a inscrição assim que a verificação for concluída

      if (!user) {
        resolve(false);
        router.navigate(['naoautorizado'], { replaceUrl: true });
      } else {
        try {
          const funcao_esperada: Funcao[] = route.data['funcao'];
          const tem_permissao = await authService.verificarPermissao(funcao_esperada);

          if (tem_permissao) {
            resolve(true);
          } else {
            resolve(false);
            router.navigate(['naoautorizado'], { replaceUrl: true });
          }
        } catch (error) {
          console.error('Erro ao obter o papel do usuário:', error);
          resolve(false);
          router.navigate(['naoautorizado'], { replaceUrl: true });
        }
      }
    });
  });
};





  





