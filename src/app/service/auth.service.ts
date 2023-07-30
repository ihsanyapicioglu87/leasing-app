import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {BASE_URL, Utils} from '../utils/utils';
import {MessageService} from 'primeng/api';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean>;
  public loggedIn$: Observable<boolean>;
  private apiUrl = BASE_URL + '/login';
  public loggedInUser$: Observable<any | null>;
  private loggedInUserSubject: BehaviorSubject<any | null>;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {
    this.loggedInSubject = new BehaviorSubject<boolean>(localStorage.getItem('loggedIn') === 'true');
    this.loggedIn$ = this.loggedInSubject.asObservable();
    this.loggedInUserSubject = new BehaviorSubject<any | null>(Utils.getUser());
    this.loggedInUser$ = this.loggedInUserSubject.asObservable();
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const response = await this.http.post<any>(this.apiUrl, { username, password })
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        )
        .toPromise();

      this.loggedInSubject.next(true);
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(response));
      this.loggedInUserSubject.next(response);

      await this.router.navigate(['/dashboard']);

      return response; // Return the response data after successful login
    } catch (error) {
      setTimeout(() => {
        this.router.navigate(['/login']);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'incorrect username or password',
        });
      }, 0);
      throw error; // Rethrow the error to be handled by the caller if needed
    }
  }

  getLoggedInUser(): any | null {
    return this.loggedInUserSubject.getValue();
  }

  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.setItem('loggedIn', 'false');
    this.loggedInSubject.next(false);
    console.log('Logged out');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.getValue();
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedIn$;
  }
}
