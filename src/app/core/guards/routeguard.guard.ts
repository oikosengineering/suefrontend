import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  constructor(private router: Router, private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.auth.isUserLoggedIn()) {
        return true;
    } else {
      let url = environment.auth_url ;
      url =  url + window.location.origin + state.url + '?code=ssoreturn';
      window.location.href = url;
      return false;
    }
  }
}
