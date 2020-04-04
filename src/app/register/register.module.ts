import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { UiModule } from '../ui/ui.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
