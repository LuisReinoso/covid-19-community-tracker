import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User as UserModel } from '../core/user.model';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { Subscription, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  user: UserModel = {};
  errorMessage$: Subject<string> = new Subject<string>();
  isLoading = false;
  private editFormSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cd: ChangeDetectorRef
  ) {
    this.editForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.userData$.subscribe(user => {
      if (user) {
        this.user = user;
        this.editForm.setValue({
          displayName: this.user.displayName,
          email: this.user.email
        });
      }
    });
    this.editFormSub = this.editForm.valueChanges.subscribe(data => this.errorMessage$.next(''));
  }

  ngOnDestroy(): void {
    if (this.editFormSub) {
      this.editFormSub.unsubscribe();
    }
  }

  updateDataUser() {
    if (this.editForm.valid) {
      this.isLoading = true;
      const user = { ...this.user, ...this.editForm.value };
      delete user.email;
      this.userService
        .updateUser(user)
        .pipe(take(1))
        .subscribe(
          () => {
            this.userService
              .updateUserDB(user.id, user)
              .pipe(take(1))
              .subscribe(
                () => {
                  this.isLoading = false;
                  this.errorMessage$.next('');
                  this.authService.setUserData(user);
                  this.notificationService.showNotification({header: 'Perfil', message: 'Perfil actualizado'});
                },
                error => this.handleError(error)
              );
          },
          error => this.handleError(error)
        );
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    this.isLoading = false;
    this.editForm.setValue({
      displayName: this.user.displayName,
      email: this.user.email
    });
    switch (error.code) {
      case 'auth/requires-recent-login':
        this.errorMessage$.next(
          'Para realizar esta operación es necesario que se autentique nuevamente'
        );
        break;
      case 'auth/email-already-in-use':
        this.errorMessage$.next('Correo ya registrado');
        break;
      default:
        this.errorMessage$.next('Error inesperado');
        break;
    }
    this.cd.detectChanges();
  }
}
