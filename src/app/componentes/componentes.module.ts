import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DashboardPageModule } from '../paginas/auth/dashboard/dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [EncabezadoComponent, MenuComponent, FooterComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    DashboardPageModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EncabezadoComponent,
    MenuComponent,
    FooterComponent
  ],
  providers: [
  ]
})
export class ComponentesModule { }
