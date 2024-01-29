import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { TenantRole } from '../../model/tenantRole';


@Injectable({
  providedIn: 'root'
})
export class TenantRoleService {

  apiurl = environment.baseUrl_OrganizationManagement;
  baseUrl_User = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }

  // Getting Tenant role list
  getAllRolesForParticularTenant(beType: string, id: number): Observable<TenantRole[]> {
    return this.http.get<TenantRole[]>(this.apiurl + 'getRolesListByBeTypeAndId/' + beType + '/' + id);
  }

  //create/Save Tenant role
  createTenantRole(TenantRole: TenantRole): Observable<TenantRole> {
    // 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<TenantRole>(`${this.apiurl + 'saveTenantRole'}`, TenantRole, httpOptions);
  }

  //Update Tenant Role
  updateTenantRole(TenantRole: TenantRole): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<void>(`${this.apiurl + 'updateRole'}`, TenantRole, httpOptions);
  }

  // To get individual tenant role list to edit
  getRoleByBeTypeAndRoleId(beType: string, roleId: number): Observable<TenantRole> {
    return this.http.get<TenantRole>(this.apiurl + 'getRoleByRoleId/' + beType + '/' + roleId);
  }

  // Save and Assign tenant role to user
  assignTenantRoleToUser(roleList): Observable<TenantRole> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<TenantRole>(`${this.baseUrl_User + 'saveTenantUserRolesByUserId'}`, roleList, httpOptions);
  }
  updateTenantRoleToUser(roleList): Observable<TenantRole> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<TenantRole>(`${this.baseUrl_User + 'updateTenantUserRolesByUserId'}`, roleList, httpOptions);
  }
}
