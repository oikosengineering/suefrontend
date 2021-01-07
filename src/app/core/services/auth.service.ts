import { EventEmitter, Injectable, Output, NgZone } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { User, Professional_Title, Jwt, Address, Birthplace, EvtSignIn, Profile, FakeUser, iFakeUser } from '../models/models';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import { AppApiService } from './app-api.service';
import { env } from 'process';
declare var window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookieservice: CookieService,
    private apiservice: AppApiService
  ) {
  }
  private isUserLogged = false;
  private isUserActive = false;
  private iduser: string;

  @Output() usersignedin = new EventEmitter();
  @Output() userislogin = new EventEmitter<EvtSignIn>();
  @Output() usersignedup = new EventEmitter();
  @Output() userlogout = new EventEmitter();
  @Output() usersetlanguage = new EventEmitter();
  @Output() useractive = new EventEmitter();

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
    if (this.cookieservice.check(environment.cookie_name)) {
      this.cookieservice.delete(environment.cookie_name, '/');
    }

    this.cookieservice.deleteAll('/');

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('type');
    localStorage.setItem('id', '-1');
    localStorage.removeItem('professional_title');
    localStorage.removeItem('status');
    this.isUserLogged = false;

    this.iduser = '-1';
    this.userlogout.emit();
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
          professional_title: localStorage.getItem('professional_title'),
          type: localStorage.getItem('type')
        }
      );
      this.iduser = localStorage.getItem('id');
    }
    return this.isUserLogged;
  }

 userActivation() {
   this.isUserActive = !!localStorage.getItem('status');
   if (this.isUserActive === false) {
     this.useractive.emit();
   }
   return this.isUserActive;
 }

  getToken() {
    return localStorage.getItem('token');
  }

  getIdUser() {
    return this.iduser;
  }

  isUserActivated() {
    this.isUserActive = localStorage.getItem('status') === 'false' ? false : true;
    return this.isUserActive;
  }

  fakesigin() {
    const fkjson = {
    };

    const fkuser: FakeUser = new FakeUser(fkjson as iFakeUser);
    // tslint:disable-next-line: max-line-length
    localStorage.setItem('token', '');
    localStorage.setItem('first_name', fkuser.ifk.user.first_name);
    localStorage.setItem('last_name', fkuser.ifk.user.last_name);
    localStorage.setItem('email', fkuser.ifk.user.email);
    localStorage.setItem('last_name', fkuser.ifk.user.last_name);
    localStorage.setItem('id', fkuser.ifk.user.id);
    localStorage.setItem('professional_title', 'fakeuser');
    localStorage.setItem('type', fkuser.ifk.type);
    localStorage.setItem('status', 'true');
    
    this.useractive.emit();
    this.isUserLogged = true;
  }

  signin() {
    if (this.cookieservice.check(environment.cookie_name)) {
      const fkjson = jwt_decode(this.cookieservice.get(environment.cookie_name));
      const fkuser: FakeUser = new FakeUser(fkjson as iFakeUser);
      if (fkuser.ifk.user.status !== undefined && fkuser.ifk.user.status !== null) {
        if (fkuser.ifk.user.status.includes('active')) {
          localStorage.setItem('token', this.cookieservice.get(environment.cookie_name));
          localStorage.setItem('first_name', fkuser.ifk.user.first_name);
          localStorage.setItem('last_name', fkuser.ifk.user.last_name);
          localStorage.setItem('email', fkuser.ifk.user.email);
          localStorage.setItem('last_name', fkuser.ifk.user.last_name);
          localStorage.setItem('id', fkuser.ifk.user.id);
          // tslint:disable-next-line: max-line-length
          localStorage.setItem('professional_title', fkuser.ifk.user.profile.professional_title === null ? '' : fkuser.ifk.user.profile.professional_title);
          localStorage.setItem('type', fkuser.ifk.type);
          localStorage.setItem('status', 'true');

          this.userislogin.emit({
            token: this.cookieservice.get(environment.cookie_name),
            id: fkuser.ifk.user.id,
            email: fkuser.ifk.user.email,
            first_name: fkuser.ifk.user.first_name,
            last_name: fkuser.ifk.user.last_name,
            professional_title: fkuser.ifk.user.profile.professional_title === null ? '' : fkuser.ifk.user.profile.professional_title,
            type: fkuser.ifk.type
          });

          this.isUserLogged = true;
          this.iduser = fkuser.ifk.user.id;
        } else if (fkuser.ifk.user.status.includes('unactive')) {
          this.isUserActive = false;
          this.useractive.emit();
        }

      } else {
        this.isUserLogged = false;
        this.isUserActive = false;
      }
    }


  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean | undefined {
    if (!token) { token = this.getToken(); }
    if (!token) { return undefined; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }

  isTokenValid(): Observable<boolean> {
    return this.apiservice.verificaToken();
  }

}
