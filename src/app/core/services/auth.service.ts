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
declare var window;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,
    private activateRoute: ActivatedRoute,
    private cookieservice: CookieService,
    private apiservice: AppApiService
  ) {
  }
  private isUserLogged = false;
  private iduser: string;

  @Output() usersignedin = new EventEmitter();
  @Output() userislogin = new EventEmitter<EvtSignIn>();
  @Output() usersignedup = new EventEmitter();
  @Output() userlogout = new EventEmitter();
  @Output() usersetlanguage = new EventEmitter();

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
    if (this.cookieservice.check('staging_comune_chiavari_ge_it_idtoken')) {
      this.cookieservice.delete('staging_comune_chiavari_ge_it_idtoken');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('type');
    localStorage.setItem('id', '-1');
    localStorage.removeItem('professional_title');
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
          professional_title: localStorage.getItem('professional_title'),
          type: localStorage.getItem('type')
        }
      );
      this.iduser = localStorage.getItem('id');
    }
    return this.isUserLogged;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getIdUser() {
    return this.iduser;
  }

  fackesigin() {
    const fkjson = {
      'iss': 'comune.chiavari.ge.it',
      'nbf': 1591272354,
      'iat': 1591272354,
      'exp': 1591275954,
      'sub': '5d4c3a51-a978-4acd-a757-520145b6268f',
      'user': {
        'id': '5d4c3a51-a978-4acd-a757-520145b6268f',
        'role': null,
        'department': null,
        'first_name': 'Simone',
        'last_name': 'Sarzano',
        'email': 's.sarzano@oikosweb.com',
        'profile': {
          'type': 'person',
          'first_name': 'Simone',
          'last_name': 'Sarzano',
          'full_name': 'Simone Sarzano',
          'document': {
            'type': 'id_card',
            'number': 'AA1234567'
          },
          'professional_title': null,
          'address': {
            'street_name': 'Via Roma 1',
            'postcode': '15033',
            'city': 'Casale Monferrato',
            'city_code': 'B885',
            'county': 'Alessandria',
            'county_code': 'AL',
            'country': 'IT'
          },
          'gender': 'M',
          'fiscal_code': 'SRZSMN77C18B885J',
          'vat': null,
          'birth_date': '18/03/1977',
          'birthplace': {
            'is_foreign': false,
            'county': 'AL',
            'county_name': 'Alessandria',
            'city': 'B885',
            'city_name': 'Casale Monferrato'
          },
          'email': 's.sarzano@oikosweb.com',
          'phone': '+393331234567'
        }
      },
      'type': 'user'
    };

    const fkuser: FakeUser = new FakeUser(fkjson as iFakeUser);
    // tslint:disable-next-line: max-line-length
    localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjb211bmUuY2hpYXZhcmkuZ2UuaXQiLCJuYmYiOjE1OTEyNzYwNjYsImlhdCI6MTU5MTI3NjA2NiwiZXhwIjoxNTkxMjc5NjY2LCJzdWIiOiI1ZDRjM2E1MS1hOTc4LTRhY2QtYTc1Ny01MjAxNDViNjI2OGYiLCJ1c2VyIjp7ImlkIjoiNWQ0YzNhNTEtYTk3OC00YWNkLWE3NTctNTIwMTQ1YjYyNjhmIiwicm9sZSI6bnVsbCwiZGVwYXJ0bWVudCI6bnVsbCwiZmlyc3RfbmFtZSI6IlNpbW9uZSIsImxhc3RfbmFtZSI6IlNhcnphbm8iLCJlbWFpbCI6InMuc2FyemFub0BvaWtvc3dlYi5jb20iLCJwcm9maWxlIjp7InR5cGUiOiJwZXJzb24iLCJmaXJzdF9uYW1lIjoiU2ltb25lIiwibGFzdF9uYW1lIjoiU2FyemFubyIsImZ1bGxfbmFtZSI6IlNpbW9uZSBTYXJ6YW5vIiwiZG9jdW1lbnQiOnsidHlwZSI6ImlkX2NhcmQiLCJudW1iZXIiOiJBQTEyMzQ1NjcifSwicHJvZmVzc2lvbmFsX3RpdGxlIjpudWxsLCJhZGRyZXNzIjp7InN0cmVldF9uYW1lIjoiVmlhIFJvbWEgMSIsInBvc3Rjb2RlIjoiMTUwMzMiLCJjaXR5IjoiQ2FzYWxlIE1vbmZlcnJhdG8iLCJjaXR5X2NvZGUiOiJCODg1IiwiY291bnR5IjoiQWxlc3NhbmRyaWEiLCJjb3VudHlfY29kZSI6IkFMIiwiY291bnRyeSI6IklUIn0sImdlbmRlciI6Ik0iLCJmaXNjYWxfY29kZSI6IlNSWlNNTjc3QzE4Qjg4NUoiLCJ2YXQiOm51bGwsImJpcnRoX2RhdGUiOiIxOFwvMDNcLzE5NzciLCJiaXJ0aHBsYWNlIjp7ImlzX2ZvcmVpZ24iOmZhbHNlLCJjb3VudHkiOiJBTCIsImNvdW50eV9uYW1lIjoiQWxlc3NhbmRyaWEiLCJjaXR5IjoiQjg4NSIsImNpdHlfbmFtZSI6IkNhc2FsZSBNb25mZXJyYXRvIn0sImVtYWlsIjoicy5zYXJ6YW5vQG9pa29zd2ViLmNvbSIsInBob25lIjoiKzM5MzMzMTIzNDU2NyJ9fSwidHlwZSI6InVzZXIifQ.rOYnRsShGPC5YEB78kakfqQhESEjIksrez5SlPVU9Aco0VSnfVD0yYSlumSkV7lO9QXbInJyKlFHJgl33j8_Di0zJwHWraJYm2EJTxI_otA25TGUmgK0D91ct3nXWW5O_pIxycTuVhVt5n81g8ZFP4CPAM5LaQxE-BcI3RYjaL0vmtviC6zBT_L5ut_N0NJ7UKCCTML99UHx_ekWrXDHEDmtXLQryJn2ParaVHFg1KfmtXZGQk64564_Pf-K9RfiA1mZD1OeSKJZNZBNdFh7Jd3zkZIueJWznDyXhBJVgaXgdSuG2TRA9AKM4l5ETk2w9GNfdfNQIWDbFjLtfnWgjw; XSRF-TOKEN=eyJpdiI6ImtMZk01a3VNd2Y3eW51ZzNFRmV0cXc9PSIsInZhbHVlIjoiZFh4cmZkVnRDM2dZYktyMmdUTUo4Z2V0TTgxNHk2RVhrU1l2WXRNUlVmY2ZDRW9ZOHB0VUFkVzlsYjI4eUNwUyIsIm1hYyI6ImZjMDFkY2VlYjFiOTE0MTI2MDYyMmU3MDAwMmQ2M2FlZWJjN2Q4MzFhMDcwODE3NGZhYjMwYTNmYzY1ODY4MGMifQ%3D%3D; chiavari_digitale_staging_session=eyJpdiI6IjBEVG9FZXlaUXR4TWJcL01hYldiM3NnPT0iLCJ2YWx1ZSI6IjZORFo0d25ma0tHZXdvT1RKbitDU21Vd09zWlpQcW16cHpZQUZKU2NWNUNBWjlEZFRLd01kZmcxdEZwVWZcL1lMIiwibWFjIjoiMWU2NWVhZDNiNjI5NDU0OWQ1MTkyMzBiZTE4NDhmZjcyZmI2YmIyNmVjMzc3YTkzZGM1MDUyMDcyMjQ3MGI4ZCJ9');
    localStorage.setItem('first_name', fkuser.ifk.user.first_name);
    localStorage.setItem('last_name', fkuser.ifk.user.last_name);
    localStorage.setItem('email', fkuser.ifk.user.email);
    localStorage.setItem('last_name', fkuser.ifk.user.last_name);
    localStorage.setItem('id', fkuser.ifk.user.id);
    localStorage.setItem('professional_title', 'fakeuser');
    localStorage.setItem('type', fkuser.ifk.type);
  }

  signin() {
    if (this.cookieservice.check('staging_comune_chiavari_ge_it_idtoken')) {
      const fkjson = jwt_decode(this.cookieservice.get('staging_comune_chiavari_ge_it_idtoken'));
      const fkuser: FakeUser = new FakeUser(fkjson as iFakeUser);
      localStorage.setItem('token', this.cookieservice.get('staging_comune_chiavari_ge_it_idtoken'));
      localStorage.setItem('first_name', fkuser.ifk.user.first_name);
      localStorage.setItem('last_name', fkuser.ifk.user.last_name);
      localStorage.setItem('email', fkuser.ifk.user.email);
      localStorage.setItem('last_name', fkuser.ifk.user.last_name);
      localStorage.setItem('id', fkuser.ifk.user.id);
      // tslint:disable-next-line: max-line-length
      localStorage.setItem('professional_title', fkuser.ifk.user.profile.professional_title === null ? '' : fkuser.ifk.user.profile.professional_title);
      localStorage.setItem('type', fkuser.ifk.type);
    }
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) { token = this.getToken(); }
    if (!token) { return true; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }

  isTokenValid(): Observable<boolean> {
    return this.apiservice.verificaToken();
  }

}
