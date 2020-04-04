import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { User as UserModel } from '../core/user.model';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage = '';
  loginForm: FormGroup;
  user: UserModel;
  faHeart = faHeart;
  isLoading = false;
  private loginFormSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loginFormSub = this.loginForm.valueChanges.subscribe(data => {
      this.errorMessage = '';
    });
  }

  ngOnDestroy(): void {
    if (this.loginFormSub) {
      this.loginFormSub.unsubscribe();
    }
  }

  processToDoAfterLogin(userCredentials: firebase.auth.UserCredential) {
    this.user.id = userCredentials.user.uid;
    this.user.email = userCredentials.user.email;
    this.user.displayName = userCredentials.user.displayName;
    this.userService.registerUserInDataBase(this.user).subscribe(
      res => {
        this.userService
          .getUserFromDB(userCredentials.user.uid)
          .valueChanges()
          .pipe(take(1))
          .subscribe(
            (user: UserModel) => {
              this.userService.user = user;
              this.authService.setUserData(this.userService.user);
              this.router.navigate(['map']);
            },
            error => console.error('Error after login', error)
          );
      },
      error => {
        this.errorMessageDuringLogin(error);
        this.userService.deleteUser().then(res => {});
      }
    );
  }

  errorMessageDuringLogin(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'Correo ya registrado';
        break;
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        this.errorMessage = 'Usuario o contraseña incorrecto';
        break;
      default:
        this.errorMessage = 'Error inesperado';
        console.error(error);
        break;
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.user = this.loginForm.value;
      this.authService
        .loginEmailPassword(this.user)
        .then(userCredentials => {
          this.userService
            .getUserFromDB(userCredentials.user.uid)
            .valueChanges()
            .pipe(take(1))
            .subscribe(
              (user: UserModel) => {
                this.isLoading = false;
                this.userService.user = user;
                this.authService.setUserData(this.userService.user);
                this.router.navigate(['map']);
              },
              error => console.error('Error login', error)
            );
        })
        .catch(error => {
          this.isLoading = false;
          this.errorMessageDuringLogin(error);
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  loginWithGoogle() {
    this.user = {};
    this.errorMessage = '';
    this.authService
      .signInGoogle()
      .then(userCredentials => {
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
                this.processToDoAfterLogin(userCredentials as firebase.auth.UserCredential);
              }
            },
            error => console.error('Error login with google', error)
          );
      })
      .catch(error => {
        this.errorMessageDuringLogin(error);
      });
  }

  loginWithFacebook() {
    this.user = {};
    this.authService
      .signInFacebook()
      .then(userCredentials => {
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
                this.processToDoAfterLogin(userCredentials as firebase.auth.UserCredential);
              }
            },
            error => console.error('Error login with facebook', error)
          );
      })
      .catch(error => {
        this.errorMessageDuringLogin(error);
      });
  }
}
