import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TenantMenu } from 'src/app/tenant/model/tenantMenu';
import { environment } from '../../../../environments/environment';
import { Menu } from '../../model/menu';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  menuUrl = environment.baseUrl_MasterDataManagement;
  baseUrl_User = environment.baseUrl_UserManagement;
  pageMenus: Menu[];
  parentMenuId = null;

  constructor(private http: HttpClient) { }

  getMenuList(): Observable<TenantMenu[]> {
    return this.http.get<TenantMenu[]>(this.menuUrl + 'menu');
  }

  getMenuListByRoleId(beType: string, id: number): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.baseUrl_User + 'getRoleListByBeTypeAndRoleId/' + beType + '/' + id);
  }
  getMenuListByMenuId(id: number): Observable<Menu> {
    return this.http.get<Menu>(this.menuUrl + 'menu/' + id);
  }
  addMenu(menu: Menu): Observable<Menu> {
    // 
    return this.http.post<Menu>(`${this.menuUrl + 'addmenu'}`, menu, httpOptions);
  }
  updateMenu(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${this.menuUrl + 'updateMenu'}`, menu, httpOptions)
    // 
  }


  // Setting sidebar menus in globally
  setSideBarMenus(sideBarMenu) {
    this.pageMenus = sideBarMenu;
  }
  // Getting sidebar menus in globally
  getSideBarMenus() {
    return this.pageMenus;
  }

  GettingParentId(id: any) {
    this.parentMenuId = id;
    setTimeout(() => {
      this.parentMenuId = null;
    }, 2000)
  }
}
