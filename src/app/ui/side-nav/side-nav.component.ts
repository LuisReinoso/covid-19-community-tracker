import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import {
  faEdit,
  faOutdent,
  faMoneyBill,
  faBook,
  faCheckSquare,
  faDollarSign,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  @Output()
  clickOnLink: EventEmitter<boolean> = new EventEmitter<boolean>();

  faUserEdit = faEdit;
  faSingOut = faOutdent;
  faMoneyBill = faMoneyBill;
  faBook = faBook;
  faCheckSquare = faCheckSquare;
  faDollarSign = faDollarSign;
  faCreditCard = faCreditCard;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService
      .logoutUser()
      .then(res => {
        this.authService.setUserData(null);
        this.router.navigate(['login']);
      })
      .catch(error => console.error('Error on logout', error));
  }
}
