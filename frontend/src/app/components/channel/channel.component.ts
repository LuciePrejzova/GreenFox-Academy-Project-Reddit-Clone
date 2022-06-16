import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { Channel } from 'src/app/interfaces/Channel';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit {
  channel$!: Observable<Channel[]>;
  userId!: any;
  isAdmin: any = false;
  imagePath: any = null;
  faTrash = faTrash;
  faImage = faImage;

  constructor(
    private channelService: ChannelService,
    private router: Router,
    private utils: UtilsService,
    private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.channel$ = this.fetchAll();
    console.log("channels: "+JSON.stringify(this.channel$));
    if (localStorage.getItem('token')) {
      const userData = this.utils.getDataFromToken();
      this.userId = userData.id;
      this.isAdmin=userData.isAdmin;
    }
  }

  fetchAll(): Observable<Channel[]> {
    const sortedByPosts:boolean = true;
    const withLimit:boolean = false;
    return this.channelService.getChannels(sortedByPosts,withLimit);
  }

  createChannel(): void {
    this.channel$ = this.fetchAll();
  }

  delete(channelName: Channel['channelName']): void {
    console.log('delete channel');
    this.channelService.deleteChannel(channelName).subscribe(() => {
      this.channel$ = this.fetchAll()
    });
  }

  joinChannel(channel: Channel) {
    this.channelService.joinChannel(channel);
  }

  // opens channel with its posts
  openChannel(channel: Channel) {
    this.router.navigate(['/channels', channel.id]);
  }
}
