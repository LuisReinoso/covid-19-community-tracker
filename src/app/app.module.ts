import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { CoreModule } from './core/core.module';
import { UiModule } from './ui/ui.module';
import { AppRoutingModule } from './app-routing.module';
import { SidebarModule } from 'ng-sidebar';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgbToastModule, NgbRadio, NgbRadioGroup } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebase, 'community-tracker-covid'),
    AngularFirestoreModule,
    BrowserModule,
    CoreModule,
    UiModule,
    NgbToastModule,
    SidebarModule.forRoot(),
    AppRoutingModule
  ],
  providers: [AngularFireAuth, AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
