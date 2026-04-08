import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { company } from '../models/company.model';
import { user } from '../models/user.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.API_URL+'/auth';

  // Global Reactive User Signal
  currentUser = signal<{ isLoggedIn: boolean; username: string }>({ isLoggedIn: false, username: '' });

  constructor(private http: HttpClient) { }

  updateAuthSignal(isLoggedIn: boolean, username: string = '') {
    this.currentUser.set({ isLoggedIn, username });
  }

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
  
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { withCredentials: true })
  }
}
