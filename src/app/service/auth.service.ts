import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BASE_URL } from '../utils/utils';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = BASE_URL;

    constructor(private http: HttpClient) { }

    loginUser(username: string, password: string) {
        const body = { username, password };
        const url = `${this.apiUrl}/login`; // Replace with the appropriate API endpoint URL

        return this.http.post(url, body).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An error occurred'; // Default error message

                if (error.error instanceof ErrorEvent) {
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }

                console.error(errorMessage);
                return throwError(errorMessage);
            })
        );
    }


    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this.http.post(`${this.apiUrl}/login`, body);
    }
}
