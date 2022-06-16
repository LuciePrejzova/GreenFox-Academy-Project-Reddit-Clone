import { Injectable } from '@angular/core';
import { Comment } from '../interfaces/Comment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { UtilsService } from './utils.service';
import { catchError, first } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private allCommentsUrl: string = 'http://localhost:3000/posts';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getComments(postId: number): Observable<Comment[]> {
    const url = `${this.allCommentsUrl}/${postId}/comments`;
    return this.http.get<Comment[]>(url);
  }

  deleteComment(commentId: number): Observable<{}> {
    let url = `${environment.apiUrl}/comments`;
    return this.http
      .delete<Comment>(`${url}/${commentId}`, httpOptions)
      .pipe(
        first(),
        catchError(
          this.errorHandlerService.handleError<Comment>('deleteComment')
        )
      );
  }

  updateComment(formData: any): Observable<{}> {
    console.log("formdata in service: " + JSON.stringify(formData))
    return this.http
      .put<Comment>(
        `${environment.apiUrl}/comments/${formData.id}`,
        { content: formData.content },
        this.httpOptions
      )
      .pipe(
        catchError(
          this.errorHandlerService.handleError<Comment>('updateComment')
        )
      );
  }
}
