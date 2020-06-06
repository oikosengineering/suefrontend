import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService} from '../services/auth.service'

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  private AUTH_HEADER = 'Authorization';
  private token: string;
  private loggedin = false;

  constructor(authservice: AuthService) {
    authservice.userislogin.subscribe((data) => { this.userloggedin(data); });
    authservice.userlogout.subscribe(() => { this.userloggedout(); });
  }
  /**
   * userllogedin controlla se l'utente è loggato, e se dovesse essere vero, va a caricare il token
   * attuale con l'oggetto data.token
   * @param  {EvtSignIn} data
   */
  private userloggedin(data) {
    this.loggedin = true;
    this.token = data.token;
  }
  /**
   * si annulla la sessione all'utente per via dell'operazione logout
   */
  private userloggedout() {
    this.loggedin = false;
    this.token = undefined;
  }
  
  /**
   * se l'utente è loggato torna true, altrimenti false
   * @returns boolean
   */
  private haveAuthentication(): boolean {
    return localStorage.getItem('token')!=null;
  }

  /**
   * si aggiunge il token per l'auteticazione all'header
   * @param  {HttpRequest<any>} request
   */
  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    if (!this.haveAuthentication()) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    if (request.url.indexOf(environment.api_url) < 0) {
      return request;
    }
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Basic ' + localStorage.getItem('token'))
    });
  }
  /**
   * @param  {HttpRequest<any>} req
   * @param  {HttpHandler} next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.haveAuthentication()) {
      return next.handle(req);
    } else {
      return next.handle(this.addAuthenticationToken(req));
    }
  }

}

