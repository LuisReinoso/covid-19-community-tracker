import { Component, OnInit } from '@angular/core';
import {
  MapOptions,
  latLng,
  tileLayer,
  Map,
  LatLng,
  LatLngBounds,
  Icon,
  icon,
  Marker
} from 'leaflet';
import { MapService } from './map.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  options: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        opacity: 0.7,
        maxZoom: 18,
        detectRetina: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ],
    zoom: 7,
    center: latLng(environment.countryCenter.center.lat, environment.countryCenter.center.lng),
    maxBounds: new LatLngBounds(
      new LatLng(environment.countryBounds.point1.lat, environment.countryBounds.point1.lng),
      new LatLng(environment.countryBounds.point2.lat, environment.countryBounds.point2.lng)
    )
  };
  private defaultIcon: Icon = icon({
    iconUrl: 'assets/markers/marker-icon.png',
    shadowUrl: 'assets/markers/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41]
  });

  constructor(private mapService: MapService) {}

  onMapReady(map: Map) {
    this.mapService.setMap(map);
  }

  ngOnInit() {
    Marker.prototype.options.icon = this.defaultIcon;
  }
}
