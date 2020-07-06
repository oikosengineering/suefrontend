import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppApiService } from '../services/app-api.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  constructor(
    private api: AppApiService,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>| Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.api.getDettagliPratica('building', route.params.idProcedure).subscribe((result) => {
        let procedure = result['data']
          if(procedure.user_id == this.auth.getIdUser()){
            resolve(true);
          } else {
            // this.router.navigate(['/home']);
            this.snackBar.open("Accesso negato", null, {duration: 2000});
            resolve(false);
          }
         })
       });
}
  
}
