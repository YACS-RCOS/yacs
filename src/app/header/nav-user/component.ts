import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'nav-user',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class NavUserComponent implements OnInit {

  constructor (private router: Router,
               private userService: UserService) { }

  ngOnInit () { }

  isLoggedIn () : boolean {
    return this.userService.isLoggedIn();
  }

  userSignInPath () : string {
    return `/users/sign_in?referer=${document.location}`;
  }

  userSignOutPath () : string {
    return "/users/sign_out";
  }
}
