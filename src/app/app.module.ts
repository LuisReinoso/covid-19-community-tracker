import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { DataModalComponent } from './data-modal/data-modal.component';
import { DaysPickerComponent } from './days-picker/days-picker.component';
import { MomentModule } from 'ngx-moment';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [AppComponent, DataModalComponent, DaysPickerComponent, MapComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'community-tracker-covid'),
    BrowserModule,
    HttpClientModule,
    LeafletModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MomentModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
