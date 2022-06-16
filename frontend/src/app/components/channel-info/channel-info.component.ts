import { Component, Input, OnInit } from '@angular/core';
import { Channel } from '../../interfaces/Channel';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss']
})
export class ChannelInfoComponent implements OnInit {
  @Input() channel!: Channel;

  faIcon = faImage;
  creationDate!: string;
  creationTime!: string;
  image!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private utils: UtilsService) {
  }

  ngOnInit(): void {
    [this.creationDate, this.creationTime] = this.utils.formatDateTime(this.channel.createdAt);

    if (this.channel.backgroundImage) {
      console.log("background image: " + this.channel.backgroundImage);
      this.image = this.utils.convertBase64ToImage(this.channel.backgroundImage);
    }
  }
}
