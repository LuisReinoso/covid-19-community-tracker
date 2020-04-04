import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { UiModule } from '../ui/ui.module';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    EditProfileRoutingModule
  ],
  declarations: [EditProfileComponent]
})
export class EditProfileModule { }
