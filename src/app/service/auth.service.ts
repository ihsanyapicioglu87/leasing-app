import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE_URL } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  private apiUrl = BASE_URL + '/login';
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): void {
    this.http.post<any>(this.apiUrl, { username, password }).subscribe(
      (response) => {
        if (response && response.role === 'admin') {
          this.loggedInSubject.next(true);
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.router.navigate(['/']);
        }
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.getValue();
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedIn$;
  }
}
