import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataAccess, SelectedDataAccess } from '../../model/dataAccess';
import { UserEntityDetails } from '../../model/userEntityDetails';
import { ResponseEntity } from 'global';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  apiurl = environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) { }


  // To get all the records for data access list
  getAssetDataAccessList(organizationId, accessGroupId, userId): Observable<DataAccess[]> {

    return this.http.get<DataAccess[]>(this.apiurl + "data-access/assets?organization-id=" + organizationId + "&access-group-id=" + accessGroupId + "&user-id=" + userId);
  }

  // To get all the records for data access list
  getGatewayDataAccessList(organizationId, accessGroupId, userId): Observable<DataAccess[]> {

    return this.http.get<DataAccess[]>(this.apiurl + "data-access/gateways?organization-id=" + organizationId + "&access-group-id=" + accessGroupId + "&user-id=" + userId);
  }

  // To get all the records for data access list
  getDashboardDataAccessList(organizationId, accessGroupId, userId): Observable<DataAccess[]> {

    return this.http.get<DataAccess[]>(this.apiurl + "data-access/dashboards?organization-id=" + organizationId + "&access-group-id=" + accessGroupId + "&user-id=" + userId);
  }

  // Create data access
  saveDataAccess(dataAccess: SelectedDataAccess): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity>(this.apiurl + 'data-access', dataAccess, httpOptions);
  }
}

