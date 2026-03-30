import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { company } from '../models/company.model';
import { user } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  googleSignIn(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, { code }, { withCredentials: true });
  }

  companySignup(Company: company): Observable<any> {
    return this.http.post(`${this.apiUrl}/company/sign-up`,Company)
  }

  userSignup(User: user): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/sign-up`,User)
  }

  userLogin(User: user): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`,User, { withCredentials: true })
  }

  companyLogin(Company: company): Observable<any> {
    return this.http.post(`${this.apiUrl}/company/login`,Company,  { withCredentials: true })
  }
}
