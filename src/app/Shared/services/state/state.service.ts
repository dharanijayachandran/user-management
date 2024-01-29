import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { State } from '../../model/state';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class StateService {

  apiurl=environment.baseUrl_MasterDataManagement;

  constructor(private http: HttpClient) {}
  
  getstatesListByCountryId(id:number): Observable<State[]> {
    return this.http.get<State[]>(this.apiurl+'states/'+id);
  }
}
