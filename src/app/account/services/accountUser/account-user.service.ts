import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountUser } from '../../model/accountUser';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountUserService {
  apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }

  // To get All account User list
  getUserListByAccountId(accountId: number): Observable<AccountUser[]> {
    return this.http.get<AccountUser[]>(this.apiurl + 'userListByAccountId/' + accountId);
  }

  // Save account user
  saveAccountUser(accountUser: AccountUser): Observable<AccountUser> {
    return this.http.post<AccountUser>(`${this.apiurl + 'saveAccountUser'}`, accountUser, httpOptions);
  }

  getAccountUserByUserId(userId: number): Observable<AccountUser> {
    return this.http.get<AccountUser>(this.apiurl + 'accountUserByUserId/' + userId);
  }
  updateAccountUser(accountUser: AccountUser): Observable<AccountUser> {
    return this.http.put<AccountUser>(`${this.apiurl + 'updateAccountUser'}`, accountUser, httpOptions);
  }

  deleteAccountUser(id: number, userId: number): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl + 'deleteAccountUser/' + userId + '/' + id}`, httpOptions);
  }

  
}
