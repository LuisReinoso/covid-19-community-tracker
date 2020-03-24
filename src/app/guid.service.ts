import { Injectable } from '@angular/core';
import * as Fingerprint2 from 'fingerprintjs2';
import { BehaviorSubject } from 'rxjs';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
declare const requestIdleCallback;

@Injectable({
  providedIn: 'root'
})
export class GuidService {
  fingerPrint$ = new BehaviorSubject<string>('');
  NAMESPACE: string;

  browserDependentComponents = {
    userAgent: true,
    sessionStorage: true,
    localStorage: true,
    indexedDb: true,
    addBehavior: true,
    openDatabase: true,
    doNotTrack: true,
    plugins: true,
    canvas: true,
    webgl: true,
    adBlock: true,
    fonts: true,
    audio: true,
    enumerateDevices: true
  };

  constructor() {
    this.NAMESPACE = environment.namespace;
    if ((window as any)?.requestIdleCallback) {
      requestIdleCallback(() => {
        this.setFingerprint();
      });
    } else {
      this.setFingerprint();
    }
  }

  private setFingerprint() {
    setTimeout(() => {
      Fingerprint2.get(
        { excludes: this.browserDependentComponents },
        (components: Array<{ key: string; value: any }>) => {
          const browserData = components.map(value => JSON.stringify(value));
          this.fingerPrint$.next(uuidv5(browserData.join(), this.NAMESPACE));
        }
      );
    }, 1500);
  }
}
