import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorData } from 'src/app/model/ErrorData';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  baseUrl_User = environment.baseUrl_UserManagement;
  constructor(private http: HttpClient) { }

  logout(): Observable<ErrorData> { 
  return this.http.get<ErrorData>(this.baseUrl_User + 'logout');
}

  getSignOnHistoryByUserId(userId): Observable<any> {
    return this.http.get<any>(this.baseUrl_User + 'users/signOnHistory/' + userId);
  }
}

