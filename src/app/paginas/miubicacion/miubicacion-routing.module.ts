import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiubicacionPage } from './miubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: MiubicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiubicacionPageRoutingModule {}
