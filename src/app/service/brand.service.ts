import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';
import {BASE_URL} from "../utils/utils";

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = BASE_URL + "/brands"; // Replace with your backend API URL for brands

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  createBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrl, brand);
  }

  updateBrand(brand: Brand): Observable<Brand> {
    const url = `${this.apiUrl}`;
    return this.http.put<Brand>(url, brand);
  }

  deleteBrand(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
