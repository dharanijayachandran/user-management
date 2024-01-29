import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { UserRole } from '../../model/userRole';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) { }

  baseUrl_User = environment.baseUrl_UserManagement;

  // save assigning roles to user
  assignRoleToUser(roleList, beType): Observable<UserRole> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<UserRole>(`${this.baseUrl_User + 'saveUserRolesByUserIdAndBeType/' + beType}`, roleList, httpOptions);
  }
  updateRoleToUser(roleList, beType): Observable<UserRole> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<UserRole>(`${this.baseUrl_User + 'updateUserRolesByUserIdAndBeType/' + beType}`, roleList, httpOptions);
  }
}
