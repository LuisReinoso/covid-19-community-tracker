import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectToLoginIfNotAuthGuard } from './core/redirect-to-login-if-not-auth.guard';
import { RedirectToMapIfAuthGuard } from './core/redirect-to-map-if-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'login',
        loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'register',
        loadChildren: () => import('src/app/register/register.module').then(m => m.RegisterModule)
      }
    ],
    canActivate: [RedirectToMapIfAuthGuard]
  },
  {
    path: '',
    children: [
      {
        path: 'map',
        loadChildren: () => import('src/app/map/map.module').then(m => m.MapModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('src/app/edit-profile/edit-profile.module').then(m => m.EditProfileModule)
      }
    ],
    canActivate: [RedirectToLoginIfNotAuthGuard]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
