import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserLocalService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userLocal = inject(UserLocalService);
  const user = userLocal.get();

  if (user?.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }

  return next(req);
};
