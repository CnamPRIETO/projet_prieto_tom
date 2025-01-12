import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token: String = '';
    constructor(private authService: AuthService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        } else {
            return next.handle(req).pipe(
                tap((evt: HttpEvent<any>) => {
                  if (evt instanceof HttpResponse) {
                    let tab: Array<String>;
                    let enteteAuthorization = evt.headers.get('Authorization');
                    if (enteteAuthorization != null) {
                      tab = enteteAuthorization.split(/Bearer\s+(.*)$/i);
                      if (tab.length > 1) {
                        this.token = tab[1];
                        console.log('Bearer récupéré : ' + this.token);
                      }
                    }
                  }
                })
              );
        }
    }
}
