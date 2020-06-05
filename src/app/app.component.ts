import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './core/services/auth.service';
import { EvtSignIn } from './core/models/models';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { Location, PathLocationStrategy } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  open = true;
  title = 'Comune di Chiavari';
  mobileQuery: MediaQueryList;
  username: string;
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

    auth.usersignedin.subscribe(
      (user: string) => {
        this.username = user;
        this.isUserLoggedIn = this.auth.isUserLoggedIn();
      }
    );
    auth.userlogout.subscribe(
      () => {
        this.username = '';
        this.isUserLoggedIn = false;
        this.router.navigate(['/']);
      }
    );
    auth.userislogin.subscribe(
      (data: EvtSignIn) => {
        this.username = data.email;
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

    //this.auth.ctrLogIn();
  }
}
