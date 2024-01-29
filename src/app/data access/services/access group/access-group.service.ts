import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { AccessGroup } from '../../model/AccessGroup';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccessGroupService {
  apiurl=environment.baseUrl_OrganizationManagement;
  constructor(private http:HttpClient) { }

  getAccessGroups(organizationId: number): Observable<AccessGroup[]> {
    return this.http.get<AccessGroup[]>(this.apiurl + 'organizations/'+organizationId+"/access-groups");
  }

 
  
}
