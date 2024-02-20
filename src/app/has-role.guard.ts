import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from './role';
import { AuthService } from './servicos/auth.service';


export const hasRoleGuard: CanActivateFn = (route, state) => {
  
  const router: Router = inject(Router);
  const userRole: Role = inject(AuthService).getUserRole();
  const expectedRoles: Role[] = route.data['roles'];

  const hasRole: boolean = expectedRoles.some((role) => userRole === role);

  //return true;
  return hasRole || router.navigate(['naoautorizado']);
};
