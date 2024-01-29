
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { AccountMenu } from '../../model/accountMenu';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountMenuService {

  baseUrl = environment.baseUrl_OrganizationManagement;
  menuUrl = environment.baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) { }

  //Get Account menus
  getAccountMenuList(tenantId, accountId): Observable<AccountMenu[]> {
    return this.http.get<AccountMenu[]>(this.baseUrl + 'accountMenus/' + accountId + '/' + tenantId);
  }

  //Save Account menu
  saveAccountMenu(SelectionMenu: AccountMenu): Observable<AccountMenu> {
    return this.http.post<AccountMenu>(`${this.baseUrl + 'saveAccountMenu/'}`, SelectionMenu, httpOptions);
  }
}
