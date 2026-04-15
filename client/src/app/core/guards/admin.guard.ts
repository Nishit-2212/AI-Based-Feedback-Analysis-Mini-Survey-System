import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const adminGuard: CanMatchFn = (route, segments) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserInfo().pipe(
    map((res: any) => {

      if (res?.success && res?.data) {
        const role = res?.data?.role;

        if (role === 'admin' || role === 'company') {
          return true;
        } else {
          console.log('You are not an admin');
          router.navigate(['/auth/login']);
          return false;
        }
      } else {
        console.log('You are not an admin');
        router.navigate(['/auth/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
