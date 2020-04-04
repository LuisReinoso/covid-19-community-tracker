import { AuthService } from '../core/auth.service';
import { User as UserModel } from '../core/user.model';
import { UserService } from '../core/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  processToDoAfterRegister(userRegistered: firebase.auth.UserCredential, user: UserModel) {
    user.id = userRegistered.user.uid;
    user.email = userRegistered.user.email;
    this.userService.registerUserInDataBase(user).subscribe(
      () => {
        this.registerForm.reset();
        this.isLoading = false;
        this.userService
          .getUserFromDB(userRegistered.user.uid)
          .valueChanges()
          .pipe(take(1))
          .subscribe(
            (user: UserModel) => {
              this.userService.user = user;
              this.authService.setUserData(this.userService.user);
              this.router.navigate(['map']);
            },
            error => console.error('Error process after register user', error)
          );
      },
      error => {
        this.isLoading = false;
        this.errorMessageDuringARegistration(error);
        this.userService.deleteUser().then(res => {});
      }
    );
  }

  errorMessageDuringARegistration(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'Correo ya registrado';
        break;
      default:
        this.errorMessage = 'Error inesperado';
        console.error(error);
        break;
    }
  }

  registerEmailPassword() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const user: UserModel = this.registerForm.value;
      this.authService
        .signInEmailPassword(user)
        .then(userRegistered => {
          this.processToDoAfterRegister(userRegistered as firebase.auth.UserCredential, user);
        })
        .catch(error => {
          this.isLoading = false;
          this.errorMessageDuringARegistration(error);
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  registerWithGoogle() {
    const user: UserModel = {};
    this.authService
      .signInGoogle()
      .then(userCredentials => {
        user.displayName = userCredentials.user.displayName;
        this.userService
          .getUserFromDB(userCredentials.user.uid)
          .valueChanges()
          .pipe(take(1))
          .subscribe(
            (user: UserModel) => {
              if (user) {
                this.userService.user = user;
                this.authService.setUserData(this.userService.user);
                this.router.navigate(['map']);
              } else {
                this.processToDoAfterRegister(
                  userCredentials as firebase.auth.UserCredential,
                  user
                );
              }
            },
            error => console.error('registerWithGoogle?????!!', error)
          );
      })
      .catch(error => {
        this.errorMessageDuringARegistration(error);
      });
  }

  registerWithFacebook() {
    const user: UserModel = {};
    this.authService
      .signInFacebook()
      .then(userCredentials => {
        user.displayName = userCredentials.user.displayName;
        this.userService
          .getUserFromDB(userCredentials.user.uid)
          .valueChanges()
          .pipe(take(1))
          .subscribe(
            (user: UserModel) => {
              if (user) {
                this.userService.user = user;
                this.authService.setUserData(this.userService.user);
                this.router.navigate(['map']);
              } else {
                this.processToDoAfterRegister(
                  userCredentials as firebase.auth.UserCredential,
                  user
                );
              }
            },
            error => console.error('Error register facebook', error)
          );
      })
      .catch(error => {
        this.errorMessageDuringARegistration(error);
      });
  }
}
