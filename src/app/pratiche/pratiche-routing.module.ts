import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuloComponent } from './modulo/modulo.component';
import { CanDeactivateGuard } from '../core/guards/can-deactivate.guard';
import { DettagliPraticaComponent } from './dettagli-pratica/dettagli-pratica.component';

const routes: Routes = [
  {
    path: ':idModulo',
    component: ModuloComponent,
    pathMatch: 'full',
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'dettagli-pratica/:idPratica',
    component: DettagliPraticaComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PraticheRoutingModule { }
