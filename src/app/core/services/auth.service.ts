import { EventEmitter, Injectable, Output, NgZone } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
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
}
