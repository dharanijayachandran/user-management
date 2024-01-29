
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Account } from '../../model/account';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})


export class AccountService {
 
  apiurl=environment.baseUrl_OrganizationManagement;

  constructor(private http: HttpClient) {}
  
  
  getAccountListByTId(id:number): Observable<Account[]> {
   return this.http.get<Account[]>(this.apiurl+'accountList/'+ id);
  }
  getAccountDetailByAccId(id:number): Observable<Account> {
    return this.http.get<Account>(this.apiurl+'account/'+ id);
   }
  addAccount(account:Account):Observable<Account>{
   return this.http.post<Account>(`${this.apiurl+'addAccount'}`,account,httpOptions);    
  }
  updateAccount(account: Account): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'updateAccount'}`, account, httpOptions);
  }
  deleteAccount(id:number,userId:number,beType:string):Observable<void>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.delete<void>(`${this.apiurl+'deleteAccount/'+beType+'/'+userId+'/'+id}`,httpOptions);
  }
}
