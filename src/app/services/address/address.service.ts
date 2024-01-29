import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { Address } from '../../model/Address';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})


export class AddressService {
 
  apiurl=environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) {}
  
  getAddressByTenIdList(id: number): Observable<Address[]> {
    // 
    return this.http.get<Address[]>(this.apiurl+'tenant/' + id);
  }

  getAddressByAccIdList(id: number):Observable<Address>{
   return this.http.post<Address>(`${this.apiurl+'account/' + id}`,httpOptions);    
  }
}
