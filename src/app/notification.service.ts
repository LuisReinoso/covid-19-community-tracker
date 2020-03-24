import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification$ = new BehaviorSubject<Notification>(null);

  constructor() {}

  showNotification(notification: Notification) {
    this.notification$.next(notification);
  }
  clearNotification() {
    this.notification$.next(null);
  }
}

export interface Notification {
  message: string;
  header: string;
}
