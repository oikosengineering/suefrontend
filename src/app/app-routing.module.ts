import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NuovaPraticaComponent } from './nuova-pratica/nuova-pratica.component';
import { RicercaPraticheComponent } from './ricerca-pratiche/ricerca-pratiche.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MiePraticheComponent } from './mie-pratiche/mie-pratiche.component';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { RouteGuard } from './core/guards/routeguard.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'nuova-pratica', component: NuovaPraticaComponent },
      { path: 'ricerca-pratiche', component: RicercaPraticheComponent },
      { path: 'login', component: LoginComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'mie-pratiche', component: MiePraticheComponent,} // canActivate: [RouteGuard]}
    ],
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
    PathLocationStrategy,
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
})
export class AppRoutingModule { }
