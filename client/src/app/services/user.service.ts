import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.API_URL+'/user';
  // private apiUrl = 'http://localhost:3000/api/user'; 

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/companies`);
  }

  getCompanySurveys(companyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/company/${companyId}/surveys`);
  }

  getSurveyInfo(surveyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/survey/${surveyId}/intro`);
  }

  getGivenSurveys(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/survey`);
  }

  startSurveyTransaction(surveyId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/survey/${surveyId}/start`, {}, { withCredentials: true });
  }
}
