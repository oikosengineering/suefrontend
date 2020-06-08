import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NuovaPraticaComponent } from './nuova-pratica/nuova-pratica.component';
import { RicercaPraticheComponent } from './ricerca-pratiche/ricerca-pratiche.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { RouteGuard } from './core/guards/routeguard.guard';
import { CookieService } from 'ngx-cookie-service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'nuova-pratica', component: NuovaPraticaComponent },
      { path: 'ricerca-pratiche', component: RicercaPraticheComponent },
    ]
  },
  {
    path: 'mie-pratiche', 
    loadChildren: () => import('./mie-pratiche/mie-pratiche.module').then(mod => mod.MiePraticheModule),
    //canActivate: [RouteGuard]
  },
  {
    path: 'pratiche',
    loadChildren: () => import('./pratiche/pratiche.module').then(mod => mod.PraticheModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    CookieService,
    PathLocationStrategy,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
})
export class AppRoutingModule { }
