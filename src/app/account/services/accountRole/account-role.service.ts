import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountRole } from '../../model/accountRole';

@Injectable({
  providedIn: 'root'
})
export class AccountRoleService {

  apiurl = environment.baseUrl_OrganizationManagement;
  baseUrl_User = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }

  // Getting Tenant role list
  getAllRolesForParticularAccount(beType: string, id: number): Observable<AccountRole[]> {
    return this.http.get<AccountRole[]>(this.apiurl + 'getRolesListByBeTypeAndId/' + beType + '/' + id);
  }

  // To get individual tenant role list to edit
  getRoleByBeTypeAndRoleId(beType: string, roleId: number): Observable<AccountRole> {
    return this.http.get<AccountRole>(this.apiurl + 'getRoleByRoleId/' + beType + '/' + roleId);
  }

  // Save and Assign tenant role to user
  assignAccountRoleToUser(roleList): Observable<AccountRole> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<AccountRole>(`${this.baseUrl_User + 'saveAccountUserRolesByUserId'}`, roleList, httpOptions);
  }
  updateAccountRoleToUser(roleList): Observable<AccountRole> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<AccountRole>(`${this.baseUrl_User + 'updateAccountUserRolesByUserId'}`, roleList, httpOptions);
  }
}
