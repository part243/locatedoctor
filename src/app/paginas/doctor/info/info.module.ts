import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoPageRoutingModule } from './info-routing.module';

import { InfoPage } from './info.page';
import { ComentariosPageModule } from '../comentarios/comentarios.module';;


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPageRoutingModule,
    ComentariosPageModule
  ],
  declarations: [InfoPage]
})
export class InfoPageModule {}
