import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverUrl = isDevMode()
    ? 'https://api.fullstackpro.es/sanvipop'
    : 'https://api.fullstackpro.es/sanvipop';

  const clonedReq = req.clone({
    url: `${serverUrl}/${req.url}`,
  });
  return next(clonedReq);
};
