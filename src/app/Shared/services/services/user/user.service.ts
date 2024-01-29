import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../model/user';
import { Role } from '../../role/model/role';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }

  getUserList(): Observable<User[]> {
    //
    return this.http.get<User[]>(this.apiurl + 'user');
  }

  getUserListByTypeAndId(id: number, beType: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiurl + 'userList/' + beType + '/' + id);
  }
  addUser(user: User): Observable<User> {
    let beType = sessionStorage.getItem('beType');
    return this.http.post<User>(`${this.apiurl + 'addUser/' + beType}`, user, httpOptions);
  }
  getUserByBeTypeAndUserId(userId: number, beType: string): Observable<User> {
    return this.http.get<User>(this.apiurl + 'user/' + beType + "/" + userId);
  }

  updateUser(user: User): Observable<User> {
    let beType = sessionStorage.getItem('beType');
    return this.http.put<User>(`${this.apiurl + 'updateUser/' + beType}`, user, httpOptions);
  }
  getUserRolesByBeTypeAndUserId(beType:string,id:number): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiurl+'getUserRolesListByBeTypeAndId/' + beType + '/' + id);
  }
  addRoleToUserByBeTypeAndUserId(roleUser:Role,beType:string):Observable<Role>{
    //
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
   return this.http.post<Role>(`${this.apiurl+'saveUserRoleByUserId/'+ beType }`,roleUser,httpOptions);
  }

  deleteUser(id:number,userId:number,beType:string):Observable<void>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl+'user/'+beType+'/'+userId+'/'+id}`,httpOptions);
  }

  deleteBeUser(id: number, userId: number, beType: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl + 'deleteUser/' + beType + '/' + userId + '/' + id}`, httpOptions);
  }
}

