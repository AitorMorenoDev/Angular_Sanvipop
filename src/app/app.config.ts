import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {baseUrlInterceptor} from './interceptors/base-url.interceptor';
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {provideGoogleId} from "./auth/google-login/google-login.config";
import {provideFacebookId} from "./auth/facebook-login/facebook-login.config";
import {provideBingmapsKey} from "./profile/bingmaps/bingmaps.config";
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideGoogleId('1066792929235-fm57ku5qv4ncifl4fkvtdsb1j6jvmmsq.apps.googleusercontent.com'),
    provideFacebookId('234349973091670', 'v19.0'),
    provideBingmapsKey('AipGv-br9tFmSkamrlbvhTK-uL1J7nm6PbcUcy73pGQQHMn6x9-_3rBSkmUMJ4Xo'),
    importProvidersFrom(SweetAlert2Module.forRoot()), provideClientHydration(),
  ],
};
