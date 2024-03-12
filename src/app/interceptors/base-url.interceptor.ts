import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverUrl = isDevMode()
    ? 'https://api.fullstackpro.es/sanvipop-lite'
    : 'https://api.fullstackpro.es/sanvipop-lite';

  const clonedReq = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(clonedReq);
};
