import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LeasingContract } from '../models/leasing-contract.model';
import { BASE_URL } from '../utils/utils';
import { Vehicle } from '../models/vehicle.model';
import { catchError } from 'rxjs/operators';
import {Customer} from "../models/customer.model";

@Injectable({
  providedIn: 'root',
})
export class LeasingContractService {
  private apiUrl = BASE_URL + '/leasing-contracts';

  constructor(private http: HttpClient) {}

  getLeasingContracts(): Observable<LeasingContract[]> {
    return this.http.get<LeasingContract[]>(`${this.apiUrl}`);
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl + '/availableVehicles').pipe(
      catchError(this.handleError<Vehicle[]>('getVehicles', []))
    );
  }

  createLeasingContract(leasingContract: LeasingContract): Observable<LeasingContract> {
    return this.http.post<LeasingContract>(`${this.apiUrl}/`, leasingContract);
  }

  updateLeasingContract(leasingContract: LeasingContract): Observable<LeasingContract> {
    return this.http.put<LeasingContract>(`${this.apiUrl}/update`, leasingContract);
  }

  deleteLeasingContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
