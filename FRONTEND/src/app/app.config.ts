import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './api.service';
import { routes } from './app.routes';
import { PanierState } from './shared/states/panier-state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthInterceptor } from './auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    importProvidersFrom(
      NgxsModule.forRoot([PanierState]),
      NgxsReduxDevtoolsPluginModule.forRoot(),
    )
  ]
};
