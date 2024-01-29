

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForgotPassword } from 'src/app/model/forgotPassword';
import { loginInput, UpdatePassword, UserData } from 'src/app/model/UserData';
import { environment } from 'src/environments/environment';
import { ResetPassword } from '../../model/resetPassword';
// import { loginInput } from './user-data';




@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl_User = environment.baseUrl_UserManagement;
  success: string;
  failure: string;

  constructor(private http: HttpClient) { }

  getUserLoginStatus(user: loginInput): Observable<UserData> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<UserData>(this.baseUrl_User + 'login', user, httpOptions);
  }

  validateUserCredentials(userCreds: loginInput): Observable<UserData> {

    return this.http.post<UserData>(this.baseUrl_User + 'login', userCreds);
  }
  ValidateResetToken(token: string): Observable<UserData> {
    return this.http.get<UserData>(this.baseUrl_User + 'resetpass?token=' + token);
  }
  initiatePasswordResetProcess(emailId: string): Observable<UserData> {
    return this.http.get<UserData>(this.baseUrl_User + 'users/reset/password/' + emailId);
  }
  changePasswordProcess(updatePassword: UpdatePassword): Observable<UserData> {
    const options = {
      headers: new HttpHeaders({
        'userId':sessionStorage.getItem("userId"),
        'Authorization': sessionStorage.getItem("sessionId")
      })
    };
    return this.http.put<UserData>(this.baseUrl_User + 'userChangePassword', updatePassword,options);
  }
  resetPasswordProcess(resetPassword: ResetPassword): Observable<ResetPassword> {
    return this.http.put<ResetPassword>(this.baseUrl_User + 'userResetPassword', resetPassword);
  }

  forgotPasswordProcess(forgotPassword: ForgotPassword): Observable<any> {

    return this.http.put<any>(this.baseUrl_User + 'forgotPassword', forgotPassword);
  }

  setSuccessMessage(message: string) {
    this.success = message;
  }

  setFailureMessage(message: string) {
    this.failure = message;
  }
  getCurrentPassword(userId: string): Observable<UpdatePassword> {
    const options = {
      headers: new HttpHeaders({
        'userId':sessionStorage.getItem("userId"),
        'Authorization': sessionStorage.getItem("sessionId")
      })
    };
    return this.http.get<UpdatePassword>(this.baseUrl_User + 'user/' + userId,options);
  }

  checkPasswordEncryption(): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl_User + 'checkPasswordEncryption');
  }
  
}

