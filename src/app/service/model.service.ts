import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Model } from '../models/model.model';
import {BASE_URL} from "../utils/utils";

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private apiUrl = BASE_URL + "/models"

  constructor(private http: HttpClient) {}

  getModels(): Observable<Model[]> {
    return this.http.get<Model[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching models:', error);
        return throwError('Failed to load models.');
      })
    );
  }

  getModelById(id: number): Observable<Model> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Model>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching model with id ${id}:`, error);
        return throwError('Failed to load model.');
      })
    );
  }

  createModel(model: Model): Observable<Model> {
    return this.http.post<Model>(this.apiUrl, model, this.getHttpOptions()).pipe(
      catchError((error) => {
        console.error('Error creating model:', error);
        return throwError('Failed to create model.');
      })
    );
  }

  updateModel(model: Model): Observable<Model> {
    const url = `${this.apiUrl}`;
    return this.http.put<Model>(url, model, this.getHttpOptions()).pipe(
      catchError((error) => {
        console.error(`Error updating model with id ${model.id}:`, error);
        return throwError('Failed to update model.');
      })
    );
  }

  deleteModel(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.getHttpOptions()).pipe(
      catchError((error) => {
        console.error(`Error deleting model with id ${id}:`, error);
        return throwError('Failed to delete model.');
      })
    );
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
}
