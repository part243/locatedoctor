import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { SortPipe } from '../../../pipes/sort.pipe';
import { MiubicacionPageModule } from '../../miubicacion/miubicacion.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    ReactiveFormsModule,
    MiubicacionPageModule
    
  ],
  declarations: [RegistroPage],
  entryComponents: [],
  providers: [
    SortPipe
  ]
})
export class RegistroPageModule {}
