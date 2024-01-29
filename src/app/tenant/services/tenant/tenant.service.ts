import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { Tenant } from '../../model/tenant';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  apiurl = environment.baseUrl_OrganizationManagement;


  constructor(private http: HttpClient) { }


  // //Getting tenant List when page load 
  // getTenantMenuList(tenantId:number): Observable<TenantMenu[]> {
  //   return this.http.get<TenantMenu[]>(this.baseUrl + 'tenantMenus/' + tenantId);
  // }

  //  //Save tenant menu
  //  SaveTenantMenu(SelectionMenu: TenantMenu, beType: string): Observable<TenantMenu> {
  //    
  //   return this.http.post<TenantMenu>(`${this.baseUrl + 'saveMenu/' + beType}`, SelectionMenu, httpOptions);
  // }

  getTenantList(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.apiurl + 'tenant');
  }

  getTenantListByOrganizationId(organizationId: number): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.apiurl + 'getTenantsByOrganizationId/' + organizationId);
  }

  addTenant(tenant: Tenant): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiurl + 'addTenant'}`, tenant, httpOptions);
  }
  getTenantDetailByTenId(id: number): Observable<Tenant> {

    return this.http.get<Tenant>(this.apiurl + 'tenant/' + id);
  }
  updateTenant(tenant: Tenant): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'updateTenant'}`, tenant, httpOptions);
  }

  deleteTenant(id: number, userId: number, beType: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl + 'deleteTenant/' + beType + '/' + userId + '/' + id}`, httpOptions);
  }

  getBusinessEntityByBId(id: number): Observable<Tenant> {

    return this.http.get<Tenant>(this.apiurl + 'businessEntity/' + id);
  }
  getUserDeatils(searchText: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiurl + 'tenant/' + searchText);
  }
}

