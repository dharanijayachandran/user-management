import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Application } from '../../model/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  baseUrl = environment.baseUrl_OrganizationManagement;
  apiurl = environment. baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) { }

  getApplicationList(isSystemAdmin): Observable<Application[]> {
    let organizationId = sessionStorage.getItem('beId');    
    return this.http.get<Application[]>(this.baseUrl + 'organizations/' + organizationId + '/applications?isSystemAdmin='+ isSystemAdmin);
  }
  
  // To populated availabale applications
   getAllApplicationList(organizationId, isSystemAdmin):Observable<Application[]> {
    return this.http.get<Application[]>(this.baseUrl + 'organizations/' + organizationId + '/applications?isSystemAdmin='+ isSystemAdmin);
  }

   // To populate the assigned applications
  getAssignedApplicationList(selectedTenantId): Observable<Application[]> {
    return this.http.get<Application[]>(this.baseUrl + 'organizations/' + selectedTenantId + '/applications?isSystemAdmin=false');
  }  

  // update 
  updateTenantApplicationAssignToUser(applicationList, tenantId): Observable<Application[]>{
    let organizationId = tenantId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<Application[]>(this.baseUrl + 'organizations/' + organizationId + '/business-entity-applications', applicationList, httpOptions);
  }

  // Save 
  SaveTenantApplicationAssignToUser(applicationList, tenantId): Observable<Application[]>{
    
    let organizationId = tenantId
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.put<Application[]>(this.baseUrl + 'organizations/' + organizationId + '/business-entity-applications', applicationList, httpOptions);
  }
}
