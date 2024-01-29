import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TenantRoleMenu } from '../../model/tenantRoleMenu';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TenantRoleMenuService {

  apiurl = environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) { }

  //Getting tenant menus assigning to Role  List when page load 
  getTenantRoleMenuList(tenantId: number, roleId: number): Observable<TenantRoleMenu[]> {
    return this.http.get<TenantRoleMenu[]>(this.apiurl + 'tenantRoleMenus/' + tenantId + "/" + roleId);
  }

  // assign Menus To TenantRole
  assignMenusToTenantRole(betype,tenId, id) {
    return this.http.get<TenantRoleMenu>(this.apiurl+ 'roleMenus/'+betype+'/'+tenId+'/'+id);
  }

  //Save tenant Role menu
  SaveTenantRoleMenu(SelectionMenu: TenantRoleMenu, beType: string): Observable<TenantRoleMenu> {
    // 
    return this.http.post<TenantRoleMenu>(`${this.apiurl + 'saveTenantRoleMenu'}`, SelectionMenu, httpOptions);
  }
}
