import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.API_URL+'/auth';
  // private apiUrl = 'http://localhost:3000/api/auth';

  logOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`,{},{ withCredentials: true});
  }


}
