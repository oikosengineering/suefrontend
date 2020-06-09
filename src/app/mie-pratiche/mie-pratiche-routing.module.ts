import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiePraticheComponent } from './mie-pratiche.component';
import { DettagliPraticaComponent } from './dettagli-pratica/dettagli-pratica.component';

const routes: Routes = [
  {
    path: '',
    component: MiePraticheComponent,
    pathMatch: 'full',
  },
  {
    path: 'dettagli-pratica/:idProcedure',
    component: DettagliPraticaComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiePraticheRoutingModule { }
