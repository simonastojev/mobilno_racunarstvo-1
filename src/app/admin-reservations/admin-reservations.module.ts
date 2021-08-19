import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminReservationsPageRoutingModule } from './admin-reservations-routing.module';

import { AdminReservationsPage } from './admin-reservations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminReservationsPageRoutingModule
  ],
  declarations: [AdminReservationsPage]
})
export class AdminReservationsPageModule {}
