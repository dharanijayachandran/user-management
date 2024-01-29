import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/Search';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class SearchUserService {
 // apiurl = environment.baseUrl_UserManagement_local;
  apiurl = environment.baseUrl_UserManagement;
  constructor(private http: HttpClient) { }

  getUserByAccountName(organizationId:number,samAccountName: string): Observable<User[]>{
    return this.http.get<User[]>(this.apiurl + 'search-user/' + organizationId+'?samAccountName='+samAccountName);
  }
 addUser(user:User[]): Observable<User>{
  return this.http.post<User>(`${this.apiurl + 'add-ad-user'}`, user, httpOptions);
 }
}
