import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Country } from '../../model/country';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  apiurl=environment.baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) {}
  
  getCountriesList(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiurl+'countries');
  }
}
