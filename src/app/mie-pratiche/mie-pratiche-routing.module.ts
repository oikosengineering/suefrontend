import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiePraticheComponent } from './mie-pratiche.component';

const routes: Routes = [
  {
    path: '',
    component: MiePraticheComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiePraticheRoutingModule { }
