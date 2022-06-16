import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, catchError, tap, map } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000";
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: User["id"];
  responseStatus!: number;
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router) { }

  // Method to check whether user is logged in.
  isLoggedIn() {
    let currentUser = localStorage.getItem('token');
    if (!currentUser) { }
    this.isUserLoggedIn$.next(true);
    return this.isUserLoggedIn$.asObservable();
  }

  // Registration endpoint
  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/registration`, user, this.httpOptions).pipe(
      first(),
      catchError(this.errorHandlerService.handleError<User>("registration")),
    )
  }

  // Login endpoint
  login(name: Pick<User, "name">, email: Pick<User, "email">, password: Pick<User, "password">): Observable<{
    status: string; token: string
  }> {
    return this.http.post<{status: string; token: string}>(`${this.url}/login`, { name, email, password}, this.httpOptions).pipe(
      first(),
      tap((tokenObject: { status: string; token: string}) => {
        localStorage.setItem("token", tokenObject.token);
        this.isUserLoggedIn$.next(true);
        this.router.navigate([""]);
      }),
      catchError(this.errorHandlerService.handleError<{
        status: string; token: string
      }>("login"))
    )
  }

  // Get the list of all users
  fetchAll(): Observable<User[]> {
    return this.http
    .get<User[]>(`${this.url}/users`, { responseType: "json" })
    .pipe(
      catchError(this.errorHandlerService.handleError<User[]>("fetchAll", []))
    )
  }

  // Account confirmation endpoint
  accountValidation(activationToken: string): Observable<any> {
    return this.http.get(`${this.url}/confirmation/${activationToken}`, {observe: 'response'})
    .pipe(
      map((response: any) => {
      this.responseStatus = response.status;
      return this.extractData(response);
    })
  )}

  extractData(response: Response) {
    return response.statusText;
  }

}
