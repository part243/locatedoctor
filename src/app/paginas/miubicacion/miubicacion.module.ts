import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiubicacionPageRoutingModule } from './miubicacion-routing.module';

import { MiubicacionPage } from './miubicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiubicacionPageRoutingModule
  ],
  declarations: [MiubicacionPage],
  exports: [MiubicacionPage]
})
export class MiubicacionPageModule {}
