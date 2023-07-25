import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn: boolean = false;

  constructor() { }

  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'password') {
      this.loggedIn = true;
      return true;
    } else {
      this.loggedIn = false;
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    this.loggedIn = false;
  }
}
