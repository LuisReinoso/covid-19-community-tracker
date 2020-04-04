import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './components/map/map.component';
import { MapRoutingModule } from './map-routing.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DataModalComponent } from './components/data-modal/data-modal.component';
import { DaysPickerComponent } from './components/days-picker/days-picker.component';
import { MainViewComponent } from './main-view.component';
import { UiModule } from '../ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ReactiveFormsModule,
    NgbModule,
    MomentModule,
    LeafletModule,
    MapRoutingModule
  ],
  declarations: [MapComponent, DataModalComponent, DaysPickerComponent, MainViewComponent]
})
export class MapModule {}
