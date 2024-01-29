import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { signOnHistoryDetails } from './model/signonhistory';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {
  apiurl = environment.baseUrl_UserManagement;
  constructor(private http: HttpClient) { }
  getUserListByBeId(beId: number): Observable<signOnHistoryDetails[]> {
    return this.http.get<signOnHistoryDetails[]>(this.apiurl + 'userDropdownListByOrganizationId/' + beId);
  }
  getCurrentSignOnUser(organizationId:number, targetTimeZone:String):Observable<signOnHistoryDetails[]> {
      return this.http.get<signOnHistoryDetails[]>(this.apiurl+'currentSignonUsers/'+organizationId +'?targetTimeZone='+targetTimeZone)
  }
  getSignOnHistory(organizationId:number,userId:number,startDate:number,endDate:number,targetTimeZone:any):Observable<signOnHistoryDetails[]> {
    return this.http.get<signOnHistoryDetails[]>(this.apiurl+'userSignonHistory/'+organizationId+'?userId='
    +userId+'&startDate='+startDate+'&endDate='+endDate+'&targetTimeZone='+targetTimeZone)
  }
  getTimeIntervalsFromFile(): Observable<any> {
    return this.http.get<any>('/assets/json/timeInterval.json');
  }
}

