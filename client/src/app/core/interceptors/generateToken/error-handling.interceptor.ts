import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  
  const http = inject(HttpClient);
  const router = inject(Router)

  return next(req).pipe(
    catchError((error:HttpErrorResponse) => {

      if(error?.error.code === 'INVALID') {
        console.log('inner refreshtoken is not found')
        router.navigate([''])
        
      }

      if(error.status === 401) {
        console.log("My access token is expired");
        const url = environment.API_URL;
        return http.post(url+'/auth/generateToken',null,{ withCredentials: true}).pipe(
          switchMap(() => {
            return next(req.clone())
          })
        )
      }



      console.log('Error message',error.error?.message);
      return throwError(() => error)
    })
  );


};
