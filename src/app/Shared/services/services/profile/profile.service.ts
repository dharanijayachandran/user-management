import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../model/user';
@Injectable({
  providedIn: 'root'
})
export class profileService {
  apiurl = environment.baseUrl_UserManagement;

  constructor(private http: HttpClient) { }

  getUserInformationByUserId(userId) {
    return this.http.get<User>(this.apiurl + 'user/' + userId);
  }
}

