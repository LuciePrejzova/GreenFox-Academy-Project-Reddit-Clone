import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  // Intercepts HTTP requests from the application to add a JWT auth token to the HTTP Authorization header if the user is logged in.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const  token = localStorage.getItem("token");
    if (token) {
      const clonedRequest = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      })
      return next.handle(clonedRequest);
    } else {
      return next.handle(req);
    }
  }
}
