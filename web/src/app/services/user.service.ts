import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  constructor () { }

  public isLoggedIn () : boolean {
    return !!this.getUser();
  }

  public getUser () : User {
    return JSON.parse(this.getCookie('yacs.user'));
  }

  private getCookie (name) : string {
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(name + '=') === 0) {
        const uriEncodedCookie = c.substring(name.length + 1, c.length);
        return decodeURIComponent(uriEncodedCookie);
      }
    }
    return null;
  }
}
