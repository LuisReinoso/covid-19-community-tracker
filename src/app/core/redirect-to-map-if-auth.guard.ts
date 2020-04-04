import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User as UserModel } from './user.model';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'firebase';

@Injectable()
export class RedirectToMapIfAuthGuard implements CanActivate {
  subjectAsObserver: ReplaySubject<any>;

  constructor(private afAuth: AngularFireAuth, public router: Router) {
    this.subjectAsObserver = new ReplaySubject(1);
    this.afAuth.auth.onAuthStateChanged(user => this.subjectAsObserver.next(user));
  }

  canActivate(): Observable<boolean> {
    return this.subjectAsObserver.pipe(
      map((userFirebase: User) => {
        try {
          const user: UserModel = JSON.parse(localStorage.getItem('user'));
          if (user && userFirebase && user.id === userFirebase.uid) {
            this.router.navigate(['map']);
            return false;
          } else {
            return true;
          }
        } catch (error) {
          localStorage.setItem('user', null);
          return true;
        }
      }),
      take(1)
    );
  }
}
