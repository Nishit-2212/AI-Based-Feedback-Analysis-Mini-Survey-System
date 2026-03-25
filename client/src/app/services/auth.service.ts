import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  googleSignIn(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google`, { code });
  }

  // // Placeholder for standard login
  // login(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, data);
  // }
}
