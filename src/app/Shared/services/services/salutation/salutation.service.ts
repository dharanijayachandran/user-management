import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Salutation } from '../../model/Salutation';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class SalutationService {

  apiurl=environment.baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) {}
  
  getSalutationsList(): Observable<Salutation[]> {
    return this.http.get<Salutation[]>(this.apiurl+'salutations');
  }
}
