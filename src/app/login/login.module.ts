import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { UiModule } from '../ui/ui.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, UiModule, ReactiveFormsModule, LoginRoutingModule]
})
export class LoginModule {}
