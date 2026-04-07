import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private apiUrl = environment.API_URL+'/surveys';
  // private apiUrl = 'http://localhost:3000/api/surveys';

  constructor(private http: HttpClient) { }

  createSurvey(survey: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/surveys`, { survey })
  }

  submitResponse(answers: any[],transactionId: any):Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${transactionId}/submit`,answers)
  }

}
