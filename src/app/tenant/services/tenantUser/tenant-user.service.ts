import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TenantUser } from '../../model/tenantUser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TenantUserService {
  apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }
  saveTenantUser(tenantUser: TenantUser): Observable<TenantUser> {
    return this.http.post<TenantUser>(`${this.apiurl + 'saveTenantUser'}`, tenantUser, httpOptions);
  }
  getUserListByTenantId(tenantId: number): Observable<TenantUser[]> {
    return this.http.get<TenantUser[]>(this.apiurl + 'userListByTenantId/' + tenantId);
  }
  getTenantUserByUserId(userId: number): Observable<TenantUser> {
    return this.http.get<TenantUser>(this.apiurl + 'tenantUserByUserId/' + userId);
  }
  updateTenantUser(tenantUser: TenantUser): Observable<TenantUser> {
    return this.http.put<TenantUser>(`${this.apiurl + 'updateTenantUser'}`, tenantUser, httpOptions);
  }

  deleteTenantUser(id: number, userId: number,signonId: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl + 'deleteTenantUser/' + userId + '/' + id+'?signon-id='+signonId}`, httpOptions);
  }
  checkAvailability(emailId): Observable<boolean> {
    return this.http.get<boolean>(this.apiurl + 'checkAvailability?emailId=' + emailId);
  }
  
}
