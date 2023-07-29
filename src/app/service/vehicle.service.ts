import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import {BASE_URL, Utils} from '../utils/utils';
import {Model} from "../models/model.model";

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
    return this.http.post<Vehicle>(this.apiUrl, vehicle, Utils.getHttpOptions()).pipe(
      catchError(this.handleError<Vehicle>('createVehicle'))
    );
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<Vehicle>(url, vehicle, Utils.getHttpOptions()).pipe(
      catchError((error: any) => throwError('Error updating customer'))
    );
  }

  deleteVehicle(id: number): Observable<Vehicle> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<Vehicle>(url, Utils.getHttpOptions()).pipe(
      catchError(this.handleError<Vehicle>('deleteVehicle'))
    );
  }

  getFilteredModels(brandId: number): Observable<Model[]> {
    return this.http.get<Model[]>(`${this.apiUrl}/filtered-models/${brandId}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
