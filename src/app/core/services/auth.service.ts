import { EventEmitter, Injectable, Output, NgZone } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { AppApiService } from './app-api.service';
import { User, Professional_Title, Jwt, Address, Birthplace, EvtSignIn, Profile } from '../models/models';
import { Router, ActivatedRoute } from '@angular/router';

declare var window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isUserLogged = false;
  private iduser: string;

  @Output() usersignedin = new EventEmitter();
  @Output() userislogin = new EventEmitter<EvtSignIn>();
  @Output() usersignedup = new EventEmitter();
  @Output() userlogout = new EventEmitter();
  @Output() usersetlanguage = new EventEmitter();

  constructor(
    private http: HttpClient,
    private apiservice: AppApiService,
    private router: Router,
    private zone: NgZone,
    private activateRoute: ActivatedRoute,
  ) {
  }
  /**
   * attraverso il token controlla se l'utente è loggato o meno
   */
  isUserLoggedIn() {
    this.isUserLogged = !!localStorage.getItem('token');
    return this.isUserLogged;
  }

  /**
   * si va a svuotare il local storage di tutti i suoi elementi e si fa un logout
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.setItem('id', '-1');
    localStorage.removeItem('type');
    this.isUserLogged = false;
    this.userlogout.emit();
    this.iduser = '-1';
  }
  /**
   * si verifica se l'utente ha effettuato il login
   */
  ctrLogIn() {
    this.isUserLogged = !!localStorage.getItem('token');
    if (this.isUserLogged) {
      this.userislogin.emit(
        {
          token: localStorage.getItem('token'),
          first_name: localStorage.getItem('first_name'),
          last_name: localStorage.getItem('last_name'),
          email: localStorage.getItem('email'),
          id: localStorage.getItem('id'),
          type: localStorage.getItem('type')
        }
      );
      this.iduser = localStorage.getItem('id');
    } else {
      this.logout();
    }
    return this.isUserLogged;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getIdUser() {
    return this.iduser;
  }

  login(code) {
    const secret: any = 'Basic ' + btoa(environment.authEndPoint.client_id + ':' + environment.authEndPoint.client_secret);
    // tslint:disable-next-line: max-line-length
    this.http.post(environment.authEndPoint.access_token_uri + '?code=' + code + '&client_id=' + environment.authEndPoint.client_id + '&client_secret=' + environment.authEndPoint.client_secret +
      '&scope=read&grant_type=' + environment.authEndPoint.grant_type + '&redirect_uri=' + environment.authEndPoint.redirect_uri
      , null, {
      // tslint:disable-next-line: max-line-length
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json;charset=UTF-8',
        Authorization: secret,
        rejectUnauthorized: 'false'
      })
    }
    ).subscribe((token: any) => {
      const bearer: any = 'Bearer ' + token.value;
      this.http.post(environment.authEndPoint.host + '/SSOServiceOAuth2'
        , null, {
        // tslint:disable-next-line: max-line-length
        headers: new HttpHeaders({
          'cache-control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json;charset=UTF-8',
          Authorization: bearer,
          rejectUnauthorized: 'false'
        })
      }
      ).subscribe((payload: Jwt) => {
        localStorage.setItem('token', token.value);
        localStorage.setItem('first_name', payload.user.first_name);
        localStorage.setItem('last_name', payload.user.last_name);
        localStorage.setItem('email', payload.user.email);
        localStorage.setItem('id', payload.user.id);
        this.iduser = payload.user.id;
        localStorage.setItem('type', payload.type);

        this.userislogin.emit({
          id: payload.user.id,
          token: token.value,
          email: payload.user.email,
          first_name: payload.user.first_name,
          last_name: payload.user.last_name,
          type: payload.type
        });

        this.isUserLogged = true;
        this.zone.run(() => {
            this.router.navigate(['/']);
        });
      },
        (httpResp: HttpErrorResponse) => {
          alert(httpResp.error.error);
          this.isUserLogged = false;
        },
      );
    });
  }

  spidLogout(token: string) {
    const bearer: any = 'Bearer ' + token;
    this.http.post(environment.authEndPoint.host + '/logout=redirect_url=' + environment.authEndPoint.redirect_uri
      , null, {
      // tslint:disable-next-line: max-line-length
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json;charset=UTF-8',
        Authorization: bearer,
        rejectUnauthorized: 'false'
      })
    }
    ).subscribe((data: any) => {
    });
  }
}
