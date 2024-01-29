import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OwnerMenu } from '../../model/ownerMenu';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class OwnerMenuService {

  baseUrl = environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) { }

  //Getting Owner menu List when page load
  getOwnerMenuList(ownerId:number, applicationCode): Observable<OwnerMenu[]> {
    return this.http.get<OwnerMenu[]>(this.baseUrl + 'ownerMenus/' + ownerId +'/application/'+ applicationCode);
  }
   //Save Owner menu
   SaveOwnerMenu(SelectionMenu: OwnerMenu, applicationCode: string): Observable<OwnerMenu> {
    return this.http.post<OwnerMenu>(`${this.baseUrl + 'saveOwnerMenu/' + applicationCode}`, SelectionMenu, httpOptions);
  }
}
