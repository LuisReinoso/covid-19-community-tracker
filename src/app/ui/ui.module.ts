import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MainNavComponent } from './main-nav/main-nav.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SideNavComponent } from './side-nav/side-nav.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgbToastModule
  ],
  declarations: [MainNavComponent, LoadingSpinnerComponent, SideNavComponent],
  exports: [
    MainNavComponent,
    SideNavComponent,
    FontAwesomeModule,
    LoadingSpinnerComponent  ]
})
export class UiModule {}
