import { Component, OnInit, Input } from '@angular/core';
import { Channel } from '../../interfaces/Channel';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-list-channels',
  templateUrl: './list-channels.component.html',
  styleUrls: ['./list-channels.component.scss']
})
export class ListChannelsComponent implements OnInit {
  @Input() channels: Channel[] = [];

  constructor(private channelService: ChannelService) { }

  ngOnInit(): void {
    this.channelService.getChannels(true, true).subscribe(channels => this.channels = channels);
  }

}
