import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeasingContract } from '../models/leasing-contract.model';
import { BASE_URL } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class LeasingContractService {
  private apiUrl = BASE_URL + '/leasing-contracts';

  constructor(private http: HttpClient) {}

  getLeasingContracts(): Observable<LeasingContract[]> {
    return this.http.get<LeasingContract[]>(`${this.apiUrl}`);
  }

  createLeasingContract(leasingContract: LeasingContract): Observable<LeasingContract> {
    return this.http.post<LeasingContract>(`${this.apiUrl}/`, leasingContract);
  }

  updateLeasingContract(leasingContract: LeasingContract): Observable<LeasingContract> {
    return this.http.put<LeasingContract>(`${this.apiUrl}/update/${leasingContract.id}`, leasingContract);
  }

  deleteLeasingContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
