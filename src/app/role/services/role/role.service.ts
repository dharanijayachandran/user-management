import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { Role } from '../../model/role';
import { ResponseEntity } from 'global';
import { Menu } from 'src/app/Shared/model/menu';


@Injectable({
  providedIn: 'root'
})
export class RoleService {

  apiurl=environment.baseUrl_OrganizationManagement;
  user_apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) {}

  getRolesByBeTypeAndId(beType:string,id:number): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiurl+'getRolesListByBeTypeAndId/' + beType + '/' + id);
  }
  getRoleByRoleId(roleId:number): Observable<Role> {
    return this.http.get<Role>(this.apiurl+'getRoleByRoleId/'+ roleId);
  }

  createRoleByBeType(role:Role,beType:string,beId:number):Observable<ResponseEntity>{
    //
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
   return this.http.post<ResponseEntity>(`${this.apiurl+'saveRole/'+ beType+'/'+beId }`,role,httpOptions);
  }

  assignMenuByroleId(menuRole:Menu,beType:string):Observable<Menu>{
    //
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
   return this.http.post<Menu>(`${this.apiurl+'saveRoleMenuByRoleId/'+ beType }`,menuRole,httpOptions);
  }

  updateRole(role:Role):Observable<ResponseEntity>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<ResponseEntity>(`${this.apiurl+'updateRole'}`,role,httpOptions);
  }


  deleteOrganizationRole(roleId:number,userId:number):Observable<ResponseEntity>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.delete<ResponseEntity>(`${this.apiurl+'deleteRole/'+userId+'/'+roleId}`,httpOptions);
  }

  getRoleListByBeId(beId: number): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiurl + 'getRolesByOrganizationId/'+beId);
  }

  //Getting selected roles(confirmed)
  getRoleListSelected(beType:string,userId: number): Observable<Role[]> {
    return this.http.get<Role[]>(this.user_apiurl + 'getUserRolesListByUserId/'+beType+'/'+userId);
  }
}
