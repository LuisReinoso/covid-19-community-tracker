import { Injectable } from '@angular/core';
import { User as UserModel } from '../core/user.model';
import { Observable, from, zip, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserModel = null;
  userSub: Subscription;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {}

  updateUser(user: UserModel): Observable<any[]> {
    return zip(
      from(this.afAuth.auth.currentUser.updateEmail(user.email)),
      from(this.afAuth.auth.currentUser.updateProfile({ displayName: user.displayName }))
    );
  }

  // valueChanges() para sacar los datos
  getUserFromDB(id: string) {
    return this.afs.doc<any>(`users/${id}`);
  }

  updateUserDB(id: string, user: Partial<UserModel>) {
    return from(this.getUserFromDB(id).update(user));
  }

  registerUserInDataBase(user: UserModel) {
    return zip(
      from(
        this.getUserFromDB(user.id).set({
          displayName: user.displayName,
          id: user.id,
          email: user.email
        })
      )
    );
  }

  deleteUser() {
    return this.afAuth.auth.currentUser.delete();
  }
}
