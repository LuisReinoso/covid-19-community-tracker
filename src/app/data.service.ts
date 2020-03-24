import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly LAST_UPDATE_ID_STORAGE = 'lastUpdate';
  readonly ID_STORAGE = 'id';

  lastUpdate$ = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient) {
    const lastUpdate = this.getFromLocalStorage(this.LAST_UPDATE_ID_STORAGE);
    if (lastUpdate) {
      this.lastUpdate$.next(lastUpdate);
    }
  }

  createCovidData(location: CovidLocation, metadata: Metadata, id: string): Observable<any> {
    return this.http.post(`${environment.api}/createCovidData`, {
      id,
      location,
      metadata
    });
  }

  updateCovidData(metadata: Metadata): Observable<any> {
    return this.http.post(`${environment.api}/updateCovidData`, {
      id: this.getGUID(),
      metadata,
      updatedAt: new Date().getTime()
    });
  }

  getProximity(location: CovidLocation): Observable<any> {
    const params = new HttpParams().append('location', JSON.stringify(location));
    return this.http.get(`${environment.api}/checkProximity`, {params});
  }

  saveLocalData(data: { location: CovidLocation; metadata: Metadata }) {
    this.saveOnLocalStorage(this.getGUID(), data);
  }

  clearLocalData(): any {
    localStorage.clear();
  }

  getLocalData(): CovidData {
    return this.getFromLocalStorage(this.getGUID(), { isObject: true });
  }

  hasLocalData(): boolean {
    return !!this.getLocalData();
  }

  setGUID(guid: string) {
    this.saveOnLocalStorage('guid', guid);
  }

  getGUID(): string {
    return this.getFromLocalStorage('guid');
  }

  private saveOnLocalStorage(id: string, data) {
    const typeData = typeof data;

    switch (typeData) {
      case 'string':
      case 'number':
        localStorage.setItem(id, data);
        break;
      case 'object':
        localStorage.setItem(id, JSON.stringify(data));
        break;
      default:
        break;
    }
  }

  private getFromLocalStorage(
    id: string,
    options: { isObject: boolean } = { isObject: false }
  ): any {
    const data = localStorage.getItem(id);
    return options.isObject ? JSON.parse(data) : data;
  }
}

export interface CovidData {
  id: string;
  location: CovidLocation;
  metadata: Metadata;
  updatedAt: number;
  createdAt: number;
}

export interface CovidLocation {
  lat: number;
  lng: number;
}

export interface Metadata {
  fiebre: boolean;
  cansancio: boolean;
  tosSeca: boolean;
  congestionNasal: boolean;
  rinorrea: boolean;
  dolorGarganta: boolean;
  diarrea: boolean;
  days: number;
  state: CovidState;
}

export enum CovidState {
  'positive' = 'positive',
  'negative' = 'negative',
  'suspect' = 'suspect',
  'false' = 'false'
}
