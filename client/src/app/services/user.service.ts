import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/user'; 

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies`);
  }

  getCompanySurveys(companyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company/${companyId}/surveys`);
  }
}
