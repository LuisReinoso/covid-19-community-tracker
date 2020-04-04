import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { faEdit, faOutdent } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  show = false;
  faUserEdit = faEdit;
  faSingOut = faOutdent;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService
      .logoutUser()
      .then(res => {
        this.authService.setUserData(null);
        this.router.navigate(['login']);
      })
      .catch(error => console.error('error on logout', error));
  }
}
