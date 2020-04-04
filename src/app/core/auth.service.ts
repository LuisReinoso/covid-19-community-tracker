import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { Observable, ReplaySubject } from 'rxjs';
import { User as UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserAuthenticated$: Observable<firebase.User> = this.afAuth.authState;
  userData$: Observable<UserModel>;
  private userLogged: ReplaySubject<UserModel> = new ReplaySubject<UserModel>();

  constructor(private afAuth: AngularFireAuth) {
    this.userData$ = this.userLogged.asObservable();
  }

  setUserData(userData: UserModel) {
    userData
      ? localStorage.setItem('user', JSON.stringify(userData))
      : localStorage.setItem('user', null);
    userData ? this.userLogged.next(userData) : this.userLogged.next(null);
  }

  getUserData(): firebase.User {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      this.setUserData(null);
      console.warn('User data cleaned');
      return null;
    }
  }

  public getDataFromFirebase() {
    return this.afAuth.authState;
  }

  loginEmailPassword(user: UserModel) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signInEmailPassword(user: UserModel) {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  signInGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signInFacebook() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  logoutUser() {
    this.setUserData(null);
    return this.afAuth.auth.signOut();
  }
}
