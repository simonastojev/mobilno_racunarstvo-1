import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerformanceDetailsPageRoutingModule } from './performance-details-routing.module';

import { PerformanceDetailsPage } from './performance-details.page';
import { PerformanceModalComponent } from '../../performance-modal/performance-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerformanceDetailsPageRoutingModule
  ],
  declarations: [PerformanceDetailsPage, PerformanceModalComponent],
  entryComponents: [PerformanceModalComponent]
})
export class PerformanceDetailsPageModule {}
