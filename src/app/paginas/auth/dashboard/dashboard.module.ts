import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { CalificacionPageModule } from '../../calificacion/calificacion.module';
import { InfoPageModule } from '../../doctor/info/info.module';
import { ComentariosPageModule } from '../../doctor/comentarios/comentarios.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    CalificacionPageModule,
    InfoPageModule,
    ComentariosPageModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
