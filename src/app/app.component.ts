import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { UserService } from './core/user.service';
import { faBars, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Covid community tracker';
  faBars = faBars;
  faArrowLeft = faArrowLeft;
  isMenuOpen = false;

  private getUserFromDBSub: Subscription;

  constructor(
    public notificationService: NotificationService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getDataFromFirebase().subscribe(
      auth => {
        console.log('auth!!', auth);
        if (auth) {
          this.getUserFromDBSub = this.userService
            .getUserFromDB(auth.uid)
            .valueChanges()
            .subscribe(
              user => {
                if (user) {
                  console.log('Authenticated');
                  this.userService.user = user;
                  console.log('this.userService.user', this.userService.user);
                  this.authService.setUserData(this.userService.user);
                  this.router.navigate(['map']);
                } else {
                  console.warn('User is null', user);
                }
              },
              error => console.error(error)
            );
        } else {
          if (this.getUserFromDBSub) {
            this.getUserFromDBSub.unsubscribe();
          }
          console.log('Not authenticated');
          localStorage.setItem('user', null);
        }
      },
      error => console.error(error)
    );
  }

  switchMenuState() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
