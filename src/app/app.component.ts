import { Component, ChangeDetectorRef, OnInit, ɵConsole } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './core/services/auth.service';
import { EvtSignIn } from './core/models/models';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Location, PathLocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  open = true;
  title = 'Comune di Chiavari';
  mobileQuery: MediaQueryList;
  profile: any;
  isUserLoggedIn = false;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private auth: AuthService,
    public router: Router,
    private cookieservice: CookieService,
    private pathLocationStrategy: PathLocationStrategy) {
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
    auth.userislogin.subscribe(
      (data: EvtSignIn) => {
        console.log(data);
        const jwt = jwt_decode(data.token);
        this.profile = jwt.user.profile;
        this.isUserLoggedIn = true;
      }
    );

    const basePath = pathLocationStrategy.getBaseHref();
    const absolutePathWithParams = pathLocationStrategy.path();

    if (basePath !== absolutePathWithParams) {
      if (absolutePathWithParams.lastIndexOf('code=') > 0) {
        if (location.hostname === 'localhost') {
          this.auth.fackesigin();
        } else {
          this.auth.signin();
        }
      }
    }

    // if (this.auth.isTokenExpired()) {
    //   console.log("Token expired");
    //   this.auth.logout();
    // }

    // if (this.auth.isTokenValid()) {
    //   console.log("Token not valid");
    //   this.auth.logout();
    // }
  }

  login() {
    const url = environment.auth_url;
    window.location.href = url;
  }

  logout(e) {
    e.preventDefault();
    this.auth.logout();
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.auth.ctrLogIn();
  }
}
