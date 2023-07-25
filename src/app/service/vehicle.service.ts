import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { BASE_URL } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = BASE_URL + '/vehicles';
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl).pipe(
      catchError(this.handleError<Vehicle[]>('getVehicles', []))
    );
  }

  getVehicleById(id: number): Observable<Vehicle> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Vehicle>(url).pipe(
      catchError(this.handleError<Vehicle>('getVehicleById'))
    );
  }

  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle, this.httpOptions).pipe(
      catchError(this.handleError<Vehicle>('createVehicle'))
    );
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const url = `${this.apiUrl}/update/${vehicle.id}`;
    return this.http.put<Vehicle>(url, vehicle, this.httpOptions).pipe(
      catchError(this.handleError<Vehicle>('updateVehicle'))
    );
  }

  deleteVehicle(id: number): Observable<Vehicle> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<Vehicle>(url, this.httpOptions).pipe(
      catchError(this.handleError<Vehicle>('deleteVehicle'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
