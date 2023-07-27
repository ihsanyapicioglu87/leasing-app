import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { BASE_URL } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
    private apiUrl = BASE_URL +'/roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRoleById(id: number): Observable<Role> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Role>(url);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    const url = `${this.apiUrl}/${role.id}`;
    return this.http.put<Role>(url, role);
  }

  deleteRole(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
