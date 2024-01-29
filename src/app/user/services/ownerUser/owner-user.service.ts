import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../../../model/user';



@Injectable({
  providedIn: 'root'
})
export class OwnerUserService {
  apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }
  saveUser(user: User, beType: string, beId: number): Observable<User> {
   /*  const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }; */
    return this.http.post<User>(`${this.apiurl + 'saveUser/' + beType + '/' + beId}`, user);
  }
  getUserListByBeId(beId: number): Observable<User[]> {
   
    return this.http.get<User[]>(this.apiurl + 'userListByOrganizationId/' + beId);
  }


  deleteOrganizationUser(id: number, userId: number,signonId: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  return this.http.delete<void>(`${this.apiurl + 'deleteUser/' + userId + '/' + id+'?signon-id='+signonId}`, httpOptions);
  }

  getUserByUserId(userId: number): Observable<User> {
    return this.http.get<User>(this.apiurl + 'user/' + userId);
  }
  updateUser(user: User): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<User>(`${this.apiurl + 'updateUser'}`, user, httpOptions);
  }

  checkMaxUsers(accountId: number): Observable<Boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<Boolean>(`${this.apiurl + 'checkMaxUsers/' + accountId}`, httpOptions);
  }

}

