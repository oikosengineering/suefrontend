import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RichiestaRotturaSuoloComponent } from './pratiche/richiesta-rottura-suolo/richiesta-rottura-suolo.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'pratiche/richiesta-rottura-suolo', component: RichiestaRotturaSuoloComponent },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
