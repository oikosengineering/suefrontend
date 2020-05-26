import { Component, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './core/services/auth.service';
import { EvtSignIn} from './core/models/models';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  open = true;
  title = 'Comune di Chiavari';
  mobileQuery: MediaQueryList;
  username: string;
  isUserLoggedIn = false;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private auth: AuthService,  public router: Router) {
    
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
  }

  login() {
    const url = environment.auth_url;
    window.location.href = url;
  }
}
