import { Component, OnInit, Input } from '@angular/core';
import { Channel } from '../../interfaces/Channel';
import { ChannelService } from 'src/app/services/channel.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss'],
})
export class ChannelItemComponent implements OnInit {
  @Input() channel!: Channel;
  @Input() isAuthenticated: boolean = false;
  message!: string;

  constructor(
    private router: Router,
    private channelService: ChannelService
  ) {}

  ngOnInit(): void {}

  joinChannel(channel: Channel) {
    this.channelService.joinChannel(channel);
  }

  // opens channel with its posts
  openChannel(channel: Channel) {
    this.router.navigate(['/channels', channel.id]);
  }
}
