import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = 'http://localhost:3000/api/company';

  constructor(private http: HttpClient) { }

  createSurvey(survey: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/surveys`, { survey })
  }

  getAllSurveys(): Observable<any> {
      return this.http.get(`${this.apiUrl}/surveys`);
  }

  deleteSurvey(surveyId: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/surveys/${surveyId}`);
  }

  toggleSurveyStatus(surveyId: string): Observable<any> {
      return this.http.patch(`${this.apiUrl}/surveys/${surveyId}/status`, {});
  }

  getCompanyQuestions(): Observable<any> {
      return this.http.get(`${this.apiUrl}/questions`);
  }
}
