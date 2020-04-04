import { Component, OnInit } from '@angular/core';
import { DataService, Metadata, CovidState } from 'src/app/data.service';
import {
  faMapMarker,
  faSyncAlt,
  faMapPin,
  faCompass,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataModalComponent } from './components/data-modal/data-modal.component';
import { NotificationService } from 'src/app/notification.service';
import { GuidService } from 'src/app/guid.service';
import { MapService } from './map.service';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CovidLocation } from 'functions/src';
@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  faMapMarker = faMapMarker;
  faSyncAlt = faSyncAlt;
  faMapPin = faMapPin;
  faCompass = faCompass;
  faSpinner = faSpinner;

  isActionInProgress$ = new ReplaySubject<boolean>();

  constructor(
    public dataService: DataService,
    public mapService: MapService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private guidService: GuidService
  ) {}

  ngOnInit(): void {
    this.guidService.fingerPrint$.subscribe(guid => this.dataService.setGUID(guid));
    this.mapService.map.subscribe();
    this.watchGPS();

    if (!environment.production) {
      this.mapService.testingPointWatcher$.subscribe((point: CovidLocation) => {
        this.saveMyData(this.getMetatadaGenerator(), point);
      });
    }
  }

  uploadData() {
    if (!this.isMobile()) {
      return;
    }

    this.isActionInProgress$.next(true);
    const modalRef = this.modalService.open(DataModalComponent, { centered: true });
    if (this.dataService.hasLocalData()) {
      modalRef.componentInstance.data = this.dataService.getLocalData();
    }
    modalRef.result
      .then((metadata: Metadata) => {
        if (this.dataService.hasLocalData()) {
          this.updateMyData(metadata);
          return;
        }
        if (this.mapService.location$.value) {
          this.saveMyData(metadata);
        } else {
          this.mapService.getMyGPSLocation();
        }
      })
      .catch(() => this.isActionInProgress$.next(false));
  }

  checkProximity() {
    if (!this.isMobile()) {
      return;
    }

    this.isActionInProgress$.next(true);
    this.dataService.getProximity(this.mapService.location$.value).subscribe(
      (position: { proximity: string }) => {
        this.mapService.setProximityAnimation(position.proximity);
        let proximity = 'lejos';
        switch (position.proximity) {
          case 'near':
            proximity = 'cerca';
            break;
          case 'warning':
            proximity = 'precaución';
            break;
          case 'far':
            proximity = 'lejos';
            break;
          default:
            break;
        }
        this.isActionInProgress$.next(false);
        this.notificationService.showNotification({
          header: 'Proximidad',
          message: `Proximidad: ${proximity}`
        });
      },
      error => this.isActionInProgress$.next(false)
    );
  }

  panToMyLocation() {
    if (!this.isMobile()) {
      return;
    }

    if (this.mapService.panToMyLocation()) {
      this.notificationService.showNotification({
        header: 'Geolocalizacón',
        message: 'Cargado tu ubicación actual'
      });
    } else {
      this.notificationService.showNotification({
        header: 'Geolocalizacón',
        message: 'Error activa tu GPS'
      });
    }
  }

  getMyGPSLocation() {
    if (!this.isMobile()) {
      return;
    }
    this.mapService.getMyGPSLocation();
  }

  private isMobile() {
    // TODO: Improve check if is mobile
    const isMobile =
      'ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/);
    if (!isMobile) {
      this.notificationService.showNotification({
        header: 'Telefono no dectectado',
        message: 'Por favor abre esta aplicación en el telefono'
      });
    }
    return isMobile;
  }

  private watchGPS() {
    this.mapService.gpsWatcher$.subscribe(message => {
      this.notificationService.notification$.next({
        header: 'GPS',
        message
      });
      this.panToMyLocation();
      this.panToMyLocation();
    });
  }

  private saveMyData(metadata: Metadata, point?: CovidLocation) {
    this.dataService
      .createCovidData(
        !environment.production && point ? point : this.mapService.location$.value,
        metadata,
        !environment.production ? Math.random().toString() : this.guidService.fingerPrint$.value
      )
      .subscribe(
        () => {
          this.dataService.saveLocalData({
            location: this.mapService.location$.value,
            metadata
          });
          this.notificationService.showNotification({
            header: 'Datos',
            message: 'Tus datos fueron almacenados'
          });
        },
        err => {
          this.notificationService.showNotification({
            header: 'Datos',
            message: 'Ocurrió un error al almacenar los datos'
          });
          console.log(err);
          this.isActionInProgress$.next(false);
        },
        () => this.isActionInProgress$.next(false)
      );
  }

  private updateMyData(metadata: Metadata) {
    this.dataService.updateCovidData(metadata).subscribe(
      () =>
        this.notificationService.showNotification({
          header: 'Datos',
          message: 'Tus datos fueron actualizados'
        }),
      err => {
        this.notificationService.showNotification({
          header: 'Datos',
          message: 'Ocurrió un error al actualizar tus datos'
        });
        this.isActionInProgress$.next(false);
        console.error(err);
      },
      () => this.isActionInProgress$.next(false)
    );
  }

  private getMetatadaGenerator(): Metadata {
    return {
      fiebre: true,
      cansancio: false,
      tosSeca: false,
      congestionNasal: false,
      rinorrea: false,
      dolorGarganta: true,
      diarrea: false,
      days: 4,
      state: CovidState.positive
    };
  }
}
