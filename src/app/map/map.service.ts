import { Injectable } from '@angular/core';
import { HeatLayer, heatLayer, HeatOptions } from 'leaflet-heat-es';
import { Map, LatLng, Marker, marker, Icon } from 'leaflet';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { CovidData, CovidLocation } from '../data.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  location$: BehaviorSubject<CovidLocation> = new BehaviorSubject<CovidLocation>(null);
  private gpsWatcher: ReplaySubject<string> = new ReplaySubject<string>(null);
  gpsWatcher$ = this.gpsWatcher.asObservable();
  private map$: BehaviorSubject<Map> = new BehaviorSubject<Map>(null);
  private heatLayer: HeatLayer;
  private marker: Marker;

  private testingPointWatcher: ReplaySubject<CovidLocation> = new ReplaySubject<CovidLocation>();
  testingPointWatcher$ = this.testingPointWatcher.asObservable();

  map = this.map$.asObservable();

  constructor() {}

  setMap(map: Map): void {
    this.map$.next(map);
    this.setupHeatLayer();
  }

  addToHeadLayer(data: CovidData[]) {
    data.forEach(covidData => {
      this.heatLayer.addLatLng(new LatLng(covidData.location.lat, covidData.location.lng));
    });
  }

  existHeadLayer(): boolean {
    return !!this.heatLayer;
  }

  panToMyLocation(): boolean {
    if (this.location$.value) {
      this.map$.value.panTo(this.location$.value);
      this.map$.value.setZoom(15);
      return true;
    }
    return false;
  }

  getMyGPSLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('my location', location);
          this.location$.next(location);
          this.gpsWatcher.next('Ubicación cargada');
        },
        error => {
          let message = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Por favor activa el GPS';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              message = 'Se ha demorado, intenta nuevamente';
              break;
            default:
              break;
          }
          this.gpsWatcher.next(message);
        }
      );
    } else {
      this.location$.next(null);
    }
  }

  setProximityAnimation(proximity: string) {
    if (!this.marker) {
      this.marker = marker([this.location$.value.lat, this.location$.value.lng]).addTo(
        this.map$.value
      );
    }
    const icon = this.marker.options.icon;
    icon.options.className = proximity;
    this.marker.setLatLng(new LatLng(this.location$.value.lat, this.location$.value.lng));
    this.marker.setIcon(icon);
  }

  private setupHeatLayer() {
    this.heatLayer = heatLayer([], {
      radius: 20
    } as HeatOptions).addTo(this.map$.value);

    if (!environment.production) {
      this.testingClickToAddMarker();
    }
  }

  private testingClickToAddMarker() {
    this.map$.value.on('click', (e: any) => {
      console.log('click location', { lat: e.latlng.lat, lng: e.latlng.lng });
      this.heatLayer.addLatLng(new LatLng(e.latlng.lat, e.latlng.lng));
      this.testingPointWatcher.next({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }
}
