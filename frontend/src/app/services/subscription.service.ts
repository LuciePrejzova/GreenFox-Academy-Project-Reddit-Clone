import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private subscriptionUrl: string = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  subscribeToChannel(
    channelName: string,
    userId: number,
    channelId: number
  ): Observable<Object> {
    const url = `${this.subscriptionUrl}/${channelName}`;
    console.log('URL:' + url);
    const body={}
    return this.http.post<Object>(url,body, httpOptions);
  }
}
