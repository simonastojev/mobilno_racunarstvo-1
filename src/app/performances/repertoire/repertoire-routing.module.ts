import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepertoirePage } from './repertoire.page';

const routes: Routes = [
  {
    path: '',
    component: RepertoirePage
  },
  {
    path: ':performanceId',
    loadChildren: () => import('./performance-details/performance-details.module').then( m => m.PerformanceDetailsPageModule)
  },
  /*
  {
    path: 'performance-detail',
    loadChildren: () => import('./performance-details/performance-details.module').then( m => m.PerformanceDetailsPageModule)
  },*/

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepertoirePageRoutingModule {}
