import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { User as UserModel } from './user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { ReplaySubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'firebase';

@Injectable()
export class RedirectToLoginIfNotAuthGuard implements CanActivate {
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
            return true;
          } else {
            this.router.navigate(['login']);
            return false;
          }
        } catch (error) {
          localStorage.setItem('user', null);
          this.router.navigate(['login']);
          return false;
        }
      })
    );
  }
}
