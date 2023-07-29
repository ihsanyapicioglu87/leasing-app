import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Customer } from '../models/customer.model';
import {BASE_URL, Utils} from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = BASE_URL + '/customers';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      catchError((error: any) => throwError('Error fetching customers'))
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Customer>(url).pipe(
      catchError((error: any) => throwError('Error fetching customer by ID'))
    );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer, Utils.getHttpOptions()).pipe(
      catchError((error: any) => throwError('Error adding customer'))
    );
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<Customer>(url, customer, Utils.getHttpOptions()).pipe(
      catchError((error: any) => throwError('Error updating customer'))
    );
  }

  deleteCustomer(id: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<void>(url, Utils.getHttpOptions()).pipe(
      catchError((error: any) => throwError('Error deleting customer'))
    );
  }
}
