import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment.dev';
import { UtilsService } from './utils.service';
import { ErrorHandlerService } from './error-handler.service';
import { PostResponseObject } from '../interfaces/PostResponseObject';
import { Post } from '../interfaces/Post';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private allPostsUrl: string = `${environment.apiUrl}/posts`;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private utils: UtilsService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getPosts(withVotes: boolean, field: string): Observable<Post[]>  {
    let url = withVotes ? this.allPostsUrl + '?votes=true' : this.allPostsUrl;

    if (field === 'title') {
      url = `${environment.apiUrl}/posts?limit=10&field=${field}`;
    }
    if (field === 'asc') {
      url = `${environment.apiUrl}/posts?limit=10&order=${field}`;
    }
    if (field === 'vote') {
      url = `${environment.apiUrl}/posts?limit=10&field=${field}`;
      return this.http.get<Post[]>(url);
    }
    
    return this.http
      .get<PostResponseObject>(url)
      .pipe(map((result) => result.posts));
  }

  getChannelPosts(channelId: number): Observable<any> {
    const url = `${this.allPostsUrl}/channel/${channelId}`;
    return this.http.get<PostResponseObject>(url);
  }

  newVote(postId: number, vote: { type: string }): Observable<Object> {
    const url = `${this.allPostsUrl}/${postId}/votes`;
    console.log('URL:' + url);
    return this.http.post<Object>(url, vote, httpOptions);
  }

  orderPostsByCreationDesc(posts: Post[]) {
    const createdAtComparison = (postA: Post, postB: Post) =>
      postB.createdAt > postA.createdAt ? 1 : -1;
    return posts.sort(createdAtComparison);
  }

  getUserPosts(): Observable<Post[]> {
    const userData = this.utils.getDataFromToken();
    return this.http.get<Post[]>(
      `${environment.apiUrl}/users/${userData.id}/posts`
    );
  }

  getVotes(postId: number): Observable<{total:number, count:number}> {
    const url = `${this.allPostsUrl}/${postId}/votes`;
    return this.http.get<{total:number, count:number}>(url);
  }

  createNewPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.allPostsUrl, post, httpOptions);
  }

  deletePost(postId: number): Observable<{}> {
    let url = `${environment.apiUrl}/posts`;
    return this.http
      .delete<Post>(`${url}/${postId}`, httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>('deletePost'))
      );
  }
}
