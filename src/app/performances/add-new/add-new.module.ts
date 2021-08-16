import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddNewPageRoutingModule } from './add-new-routing.module';

import { AddNewPage } from './add-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddNewPageRoutingModule
  ],
  declarations: [AddNewPage]
})
export class AddNewPageModule {}
