import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RichiestaRotturaSuoloComponent } from './pratiche/moduli/richiesta-rottura-suolo/richiesta-rottura-suolo.component';
import { HomeComponent } from './home/home.component';
import { NuovaPraticaComponent } from './nuova-pratica/nuova-pratica.component';
import { RicercaPraticheComponent } from './ricerca-pratiche/ricerca-pratiche.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MiePraticheComponent } from './mie-pratiche/mie-pratiche.component';
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
      { path: 'mie-pratiche', component: MiePraticheComponent, canActivate: [RouteGuard]}
    ],
  },
  {
    path: 'pratiche/:idModulo/:idPratica',
    loadChildren: () => import('./pratiche/pratiche.module').then(mod => mod.PraticheModule),
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
