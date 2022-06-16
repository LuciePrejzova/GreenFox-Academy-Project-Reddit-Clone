import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { ChannelService } from "../services/channel.service";
import { map } from "rxjs";

// Validate channelName (slug) only if not existing in database
export function channelnameValidator(channelService: ChannelService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return channelService.getChannels(false, false)
    .pipe(
      map(channels => {
        const channel = channels.find(channel => channel.channelName == control.value);
        return channel ? {channelExists: true} : null;
      })
    )
  }
}

// Validate channel name (or title) only if not existing in database
export function channeltitleValidator(channelService: ChannelService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return channelService.getChannels(false, false)
    .pipe(
      map(channels => {
        const channel = channels.find(channel => channel.name == control.value);
        return channel ? {channelExists: true} : null;
      })
    )
  }
}
