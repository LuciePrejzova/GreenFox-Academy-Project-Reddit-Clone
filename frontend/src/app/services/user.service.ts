import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev';
import { ErrorHandlerService } from './error-handler.service';
import { UtilsService } from './utils.service';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user!: Partial<User>;
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private utils: UtilsService
  ) {}

  getUserInfo(): Observable<User> {
    const userData = this.utils.getDataFromToken();

    return this.http.get<User>(
      `${environment.apiUrl}/users/${userData.name}`,
      this.httpOptions
    );
  }

  updateUserInfo(formData: Partial<User>, profilePicture: any): any {
    const userData = this.utils.getDataFromToken();

    if (profilePicture) {
      console.log('here it comes');
      return this.http
        .put<User>(
          `${environment.apiUrl}/users/${userData.id}`,
          { profilePicture: profilePicture },
          this.httpOptions
        )
        .pipe(
          catchError(
            this.errorHandlerService.handleError<User>('updateUserInfo')
          )
        );
    }
    if (formData.email) {
      return this.http
        .put<User>(
          `${environment.apiUrl}/users/${userData.id}`,
          { email: formData.email },
          this.httpOptions
        )
        .pipe(
          catchError(
            this.errorHandlerService.handleError<User>('updateUserInfo')
          )
        );
    }
    if (formData.password && formData.password_repeat) {
      if (formData.password === formData.password_repeat) {
        return this.http
          .put<User>(
            `${environment.apiUrl}/users/${userData.id}`,
            { password: formData.password },
            this.httpOptions
          )
          .pipe(
            catchError(
              this.errorHandlerService.handleError<User>('updateUserInfo')
            )
          );
      } else return;
    }
  }
}
