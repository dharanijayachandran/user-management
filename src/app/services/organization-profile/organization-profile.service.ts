import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrganizationProfile } from '../../model/organizationProfile';

@Injectable({
  providedIn: 'root'
})
export class OrganizationProfileService {

  apiurl=environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) {}
  
  getOrganizationProfileById(id:number): Observable<OrganizationProfile> {
    // const options = {
    //   headers: new HttpHeaders({
    //     'userId':sessionStorage.getItem("userId"),
    //     'Authorization': sessionStorage.getItem("sessionId")
    //   })
    // };
    return this.http.get<OrganizationProfile>(this.apiurl+'organization/'+'profile/'+id);
  }
}
