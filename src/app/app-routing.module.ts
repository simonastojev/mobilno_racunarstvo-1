import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [

  {
    path: 'performances',
    loadChildren: () => import('./performances/performances.module').then( m => m.PerformancesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'performances',
    pathMatch: 'full'
  },
  {
    path: 'log-in',
    loadChildren: () => import('./auth/log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'admin-profile',
    loadChildren: () => import('./admin-profile/admin-profile.module').then( m => m.AdminProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'admin-users',
    loadChildren: () => import('./admin-users/admin-users.module').then( m => m.AdminUsersPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./auth/welcome/welcome.module').then( m => m.WelcomePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
