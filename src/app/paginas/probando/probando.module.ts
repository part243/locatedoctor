import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProbandoPageRoutingModule } from './probando-routing.module';

import { ProbandoPage } from './probando.page';
import { CalificacionPageModule } from '../calificacion/calificacion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProbandoPageRoutingModule,
    CalificacionPageModule
  ],
  declarations: [ProbandoPage]
})
export class ProbandoPageModule {}
