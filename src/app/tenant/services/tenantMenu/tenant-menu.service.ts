import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { OrganizationMenu } from '../../model/OrganizationMenu';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class TenantMenuService {
  baseUrl = environment.baseUrl_OrganizationManagement;
  constructor(private http: HttpClient) { }

  //Getting tenant List when page load
  getTenantMenuList(loggedinUserOrganizationId: number, selectedOrganizationId: number, applicationCode):Observable<OrganizationMenu[]> {
    return this.http.get<OrganizationMenu[]>(this.baseUrl + "organization/menus/" + "?loggedinUserOrganizationId=" + loggedinUserOrganizationId + "&selectedOrganizationId=" + selectedOrganizationId + "&application-code="+applicationCode);
  }

  //Save tenant menu
  SaveTenantMenu(organizationMenu: OrganizationMenu, applicationCode: string): Observable<OrganizationMenu> {
    return this.http.post<OrganizationMenu>(`${this.baseUrl + 'saveOrganizationMenu/' + applicationCode}`, organizationMenu, httpOptions);
  }

}
