import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class CookieInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true
    });
    
    return next.handle(req).pipe(
      tap(evt => {
      
        if (evt instanceof HttpResponse) {
          console.table(evt.headers);
        }
        if (evt instanceof HttpRequest) {
          console.log(evt.headers.getAll('Set-Cookie'));
        }
      }));
  }
}
