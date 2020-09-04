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
    if (this.cookieservice.check('staging_comune_chiavari_ge_it_idtoken')) {
      this.cookieservice.delete('staging_comune_chiavari_ge_it_idtoken', '/');
    }
    if (this.cookieservice.check('staging_comune_chiavari_ge_it_idtoken_refresh_token')) {
      this.cookieservice.delete('staging_comune_chiavari_ge_it_idtoken_refresh_token', '/');
    }
    if (this.cookieservice.check('chiavari_digitale_staging_session')) {
      this.cookieservice.delete('chiavari_digitale_staging_session', '/');
    }
    if (this.cookieservice.check('chiavari_data')) {
      this.cookieservice.delete('chiavari_data', '/');
    }
    if (this.cookieservice.check('staging_comune_chiavari_ge_it_idtoken')) {
      this.cookieservice.delete('staging_comune_chiavari_ge_it_idtoken', '/');
    }
    if (this.cookieservice.check('XSRF-TOKEN')) {
      this.cookieservice.delete('XSRF-TOKEN', '/');
    }

    this.cookieservice.deleteAll('/');
    this.cookieservice.deleteAll('/', '.digitale.comune.chiavari.ge.it');

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
      "iss": "comune.chiavari.ge.it",
      "nbf": 1591276066,
      "iat": 1591276066,
      "exp": 1591279666,
      "sub": "5c82bcb3-e774-47c4-854b-074934b271cf",
      "user": {
        "id": "5c82bcb3-e774-47c4-854b-074934b271cf",
        "role": null,
        "department": null,
        "first_name": "Simone",
        "last_name": "Sarzano",
        "email": "s.sarzano@oikosweb.com",
        "profile": {
          "type": "person",
          "first_name": "Simone",
          "last_name": "Sarzano",
          "full_name": "Simone Sarzano",
          "document": {
            "type": "id_card",
            "number": "AA1234567"
          },
          "professional_title": null,
          "address": {
            "street_name": "Via Roma 1",
            "postcode": "15033",
            "city": "Casale Monferrato",
            "city_code": "B885",
            "county": "Alessandria",
            "county_code": "AL",
            "country": "IT"
          },
          "gender": "M",
          "fiscal_code": "SRZSMN77C18B885J",
          "vat": null,
          "birth_date": "18/03/1977",
          "birthplace": {
            "is_foreign": false,
            "county": "AL",
            "county_name": "Alessandria",
            "city": "B885",
            "city_name": "Casale Monferrato"
          },
          "email": "s.sarzano@oikosweb.com",
          "phone": "+393331234567"
        }
      },
      "type": "user"
    };

    const fkuser: FakeUser = new FakeUser(fkjson as iFakeUser);
    // tslint:disable-next-line: max-line-length
    localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJjb211bmUuY2hpYXZhcmkuZ2UuaXQiLCJuYmYiOjE1OTkyMzIyNjMsImlhdCI6MTU5OTIzMjI2MywiZXhwIjoxNTk5MjM1ODYzLCJzdWIiOiI1YzgyYmNiMy1lNzc0LTQ3YzQtODU0Yi0wNzQ5MzRiMjcxY2YiLCJ1c2VyIjp7ImlkIjoiNWM4MmJjYjMtZTc3NC00N2M0LTg1NGItMDc0OTM0YjI3MWNmIiwicm9sZSI6Im1hbmFnZXIiLCJzdGF0dXMiOiJhY3RpdmUiLCJkZXBhcnRtZW50IjoiZWRpbGl6aWEiLCJlbWFpbCI6InMuc2FyemFub0BvaWtvc3dlYi5jb20iLCJwcm9maWxlIjp7InR5cGUiOiJwZXJzb24iLCJmaXJzdF9uYW1lIjoiU2ltb25lIiwibGFzdF9uYW1lIjoiU2FyemFubyIsImZ1bGxfbmFtZSI6IlNpbW9uZSBTYXJ6YW5vIiwiZG9jdW1lbnQiOnsidHlwZSI6ImlkX2NhcmQiLCJudW1iZXIiOiJBQTEyMzQ1NjcifSwicHJvZmVzc2lvbmFsX3RpdGxlIjpudWxsLCJhZGRyZXNzIjp7InN0cmVldF9uYW1lIjoiQ29yc28gVmFsZW50aW5vIDE5NiIsInBvc3Rjb2RlIjoiMTUwMzMiLCJjaXR5IjoiQ2FzYWxlIE1vbmZlcnJhdG8iLCJjaXR5X2NvZGUiOiJCODg1IiwiY291bnR5IjoiQWxlc3NhbmRyaWEiLCJjb3VudHlfY29kZSI6IkFMIiwiY291bnRyeSI6IklUIn0sImdlbmRlciI6Ik0iLCJmaXNjYWxfY29kZSI6IlNSWlNNTjc3QzE4Qjg4NUoiLCJ2YXQiOm51bGwsImJpcnRoX2RhdGUiOiIxOFwvMDNcLzE5NzciLCJiaXJ0aHBsYWNlIjp7ImlzX2ZvcmVpZ24iOmZhbHNlLCJjb3VudHkiOiJBTCIsImNvdW50eV9uYW1lIjoiQWxlc3NhbmRyaWEiLCJjaXR5IjoiQjg4NSIsImNpdHlfbmFtZSI6IkNhc2FsZSBNb25mZXJyYXRvIn0sImVtYWlsIjoicy5zYXJ6YW5vQG9pa29zd2ViLmNvbSIsInBob25lIjoiKzM5MzkyNzEwMzIxMiJ9fSwidHlwZSI6InVzZXIifQ.c4vJ0Ut1W-vlUdL4q33Vx6odRat50yOYL7KgqaYqEk-F9rnC_CPE_vWxu5pQcvNP4hZbGY42GjV3cUazgXFI6RQMRVFqYVW9GS7jkNxdLnv20EfzqzPbLeTpEV7kS_tPuD2BuC_mw27yxNe5HeRVuYZ3v8rv-tIVPizeMr0NNneTUl02bgB7dqUbto8K5e-uUcTsPPS7jkd34nePusG_FkPfOtERL_6i6xhiR8Ec0NnAeNlKRhIWqjddxQ0A681dZrnuJrPKRg7DW3wjfBNqhOo59jko_qbVGQxDbB8rzcUWZa7UMdPC4qpB7hS6GP5AzQ6YszQaaYTIy-yGerr76A');
    localStorage.setItem('first_name', fkuser.ifk.user.first_name);
    localStorage.setItem('last_name', fkuser.ifk.user.last_name);
    localStorage.setItem('email', fkuser.ifk.user.email);
    localStorage.setItem('last_name', fkuser.ifk.user.last_name);
    localStorage.setItem('id', fkuser.ifk.user.id);
    localStorage.setItem('professional_title', 'fakeuser');
    localStorage.setItem('type', fkuser.ifk.type);
    localStorage.setItem('status', 'true');
    
    this.useractive.emit();

    // this.userislogin.emit({
    //   token: localStorage.getItem('token'),
    //   id: fkuser.ifk.user.first_name,
    //   email: fkuser.ifk.user.email,
    //   first_name: fkuser.ifk.user.first_name,
    //   last_name: fkuser.ifk.user.last_name,
    //   professional_title: fkuser.ifk.user.profile.professional_title === null ? '' : fkuser.ifk.user.profile.professional_title,
    //   type: fkuser.ifk.type
    // });

    this.isUserLogged = true;
  }

  signin() {
    if (this.cookieservice.check('staging_comune_chiavari_ge_it_idtoken')) {
      const fkjson = jwt_decode(this.cookieservice.get('staging_comune_chiavari_ge_it_idtoken'));
      const fkuser: FakeUser = new FakeUser(fkjson as iFakeUser);
      if (fkuser.ifk.user.status !== undefined && fkuser.ifk.user.status !== null) {
        if (fkuser.ifk.user.status.includes('active')) {
          localStorage.setItem('token', this.cookieservice.get('staging_comune_chiavari_ge_it_idtoken'));
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
            token: this.cookieservice.get('staging_comune_chiavari_ge_it_idtoken'),
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
