import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { RoleMenu } from '../../model/roleMenu';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RoleMenuService {

  apiurl = environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) { }

  // Getting all role menus
  getAccRoleMenuList(betype, beid, id){
    return this.http.get<RoleMenu[]>(this.apiurl + 'roleMenus/' + betype + '/' + beid + '/' + id);
  }
/* After clicking dropdown controller */
  getRoleMenuList(betype, beid, id, applicationCode){
    return this.http.get<RoleMenu[]>(this.apiurl + 'roleMenus/' + betype + '/' + beid + '/' + id + '/' + applicationCode);
  }

  //Save role menus
  saveRoleMenus(roleMenus):Observable<RoleMenu>{
    return this.http.post<RoleMenu>(this.apiurl+'saveRoleMenuByRoleId', roleMenus, httpOptions);
   }

}
