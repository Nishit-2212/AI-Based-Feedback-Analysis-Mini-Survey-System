import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private apiUrl = 'http://localhost:3000/api/company';

  constructor(private http: HttpClient) { }

  createSurvey(survey: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/surveys`, { survey })
  }

}
