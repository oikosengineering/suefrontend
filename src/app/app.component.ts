import { Component, ChangeDetectorRef, OnInit, ɵConsole } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './core/services/auth.service';
import { EvtSignIn } from './core/models/models';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { Location, PathLocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  open = true;
  title = 'SUEFrontend';
  mobileQuery: MediaQueryList;
  profile: any;
  isUserLoggedIn = false;
  isUserActive = false;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private auth: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private cookieservice: CookieService,
    private pathLocationStrategy: PathLocationStrategy,
    private snackBar: MatSnackBar,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.isUserLoggedIn = this.auth.isUserLoggedIn();

    auth.userlogout.subscribe(
      () => {
        this.isUserLoggedIn = false;
        this.router.navigate(['/']);
      }
    );

    auth.useractive.subscribe(
      () => {
        console.log(this.auth.isUserActivated());
        if (this.auth.isUserActivated() === false) {
          this.snackBar.open('Utente non ancora attivato! Aspetta la mail di conferma attivazione.', null, { duration: 10000 });
          this.auth.logout();
        }
      }
    );

    auth.userislogin.subscribe(
      (data: EvtSignIn) => {
        const jwt = jwt_decode(data.token);
        this.profile = jwt.user.profile;
        this.isUserLoggedIn = true;
        this.isUserActive = true;

        if (environment.production) {
          if (this.auth.isTokenExpired()) {
          this.auth.logout();
          }
        }
      }
    );

    const basePath = pathLocationStrategy.getBaseHref();
    const absolutePathWithParams = pathLocationStrategy.path();

    if (basePath !== absolutePathWithParams) {
      if (absolutePathWithParams.lastIndexOf('code=') > 0) {
        if (location.hostname === 'localhost') {
          this.auth.fakesigin();
        } else {
          this.auth.signin();
        }
      }
    }

  }

  login() {
    let url = environment.auth_url;
    url = url + window.location.href + '?code=ssoreturn';
    window.location.href = url;
  }

  logout(e) {
    e.preventDefault();
    let url = environment.logout_url;
    window.location.href = url;
    this.auth.logout();
  }

  ngOnInit() {
    if (this.auth.userActivation()) {
      this.auth.ctrLogIn();
    }
  }
}
