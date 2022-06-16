import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {

  // Handle error when caught
  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message} error.status: ${error.status}`);
      return of(result as T);
    }
  }
}
