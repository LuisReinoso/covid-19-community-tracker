import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RedirectToLoginIfNotAuthGuard } from './redirect-to-login-if-not-auth.guard';
import { RedirectToMapIfAuthGuard } from './redirect-to-map-if-auth.guard';

@NgModule({
  imports: [HttpClientModule],
  providers: [RedirectToLoginIfNotAuthGuard, RedirectToMapIfAuthGuard]
})
export class CoreModule {}
