import { Component, ChangeDetectorRef  } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoggedIn: boolean = false;
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService,  private router: Router, private cdr: ChangeDetectorRef) { }

  onLoginClick() {
    this.authService.loginUser(this.username, this.password).subscribe(
      (response) => {
        this.isLoggedIn = true;
        console.log('Login successful!');
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}
