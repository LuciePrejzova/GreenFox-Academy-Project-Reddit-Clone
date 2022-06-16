import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UtilsService } from './utils.service';
import { AlertsService } from './alerts.service';
import { ErrorHandlerService } from './error-handler.service';
import { SubscriptionService } from './subscription.service';
import { Channel } from '../interfaces/Channel';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private url = 'http://localhost:3000/channels/';
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
    private router: Router,
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private subService: SubscriptionService,
    private alertsService: AlertsService
  ) {}

  joinChannel(channel: Channel) {
    this.subService
      .subscribeToChannel(channel.channelName, 1, channel.id)
      .pipe(catchError(this.errorHandlerService.handleError('joinChannel')))
      .subscribe((data) => {
        if (data == undefined) {
          this.alertsService.sweetAlertError(
            'Join unsuccessful!',
            "Please make sure you are logged in and you haven't already joined this channel."
          );
        } else {
          this.alertsService.sweetAlertSuccess('Succesfully joined!', 'Enjoy!');
          this.router.navigate(['/channels', channel.id]);
        }
      });
  }

  // Create channel
  createChannel(formData: Partial<Channel>): Observable<Channel> {
    return this.http
      .post<Channel>(
        this.url,
        {
          name: formData.name,
          channelName: formData.channelName,
          backgroundImage: this.utilsService.base64code,
          description: formData.description,
        },
        this.httpOptions
      )
      .pipe(
        tap(() => {
          if (formData.channelName != undefined) {
            this.getChannelByChannelName(formData.channelName).subscribe(
              (newChannel: any) => {
                this.authService.isUserLoggedIn$.next(true);
                this.router.navigate(['/channel', newChannel.id]);
              }
            );
          }
        }),
        catchError(
          this.errorHandlerService.handleError<Channel>('createChannel')
        )
      );
  }

  // Delete channel
  deleteChannel(channelName: Channel['channelName']): Observable<{}> {
    let url = `${environment.apiUrl}/channels`;
    return this.http
      .delete<Channel>(`${url}/${channelName}`, this.httpOptions)
      .pipe(
        first(),
        catchError(
          this.errorHandlerService.handleError<Channel>('deleteChannel')
        )
      );
  }

  // Return channel by channelName (slug)
  getChannelByChannelName(channelName: Channel['channelName']): Observable<{}> {
    let url = `${environment.apiUrl}/channels/`;
    return this.http
      .get<Channel>(`${url}${channelName}`, this.httpOptions)
      .pipe(
        first(),
        catchError(
          this.errorHandlerService.handleError<Channel>('deleteChannel')
        )
      );
  }

  getChannels(withField: boolean, withLimit: boolean): Observable<Channel[]> {
    let url = `${environment.apiUrl}/channels`;
    if (withField) {
      url = `${environment.apiUrl}/channels?field=post`;
    }
    if (withLimit) {
      url = `${environment.apiUrl}/channels?field=post&limit=5`;
    }
    return this.http
      .get<Channel[]>(url, { responseType: 'json' })
      .pipe(
        catchError(
          this.errorHandlerService.handleError<Channel[]>('getChannels', [])
        )
      );
  }
}
