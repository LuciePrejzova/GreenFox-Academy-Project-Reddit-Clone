import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { first } from 'rxjs';
import { channelnameValidator, channeltitleValidator } from 'src/app/validators/channel.validator';
import { AlertsService } from 'src/app/services/alerts.service';
import { UtilsService } from 'src/app/services/utils.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
})
export class CreateChannelComponent implements OnInit {
  @ViewChild('formDirective') formDirective!: NgForm;
  @Output() create: EventEmitter<any> = new EventEmitter();
  channelForm!: FormGroup;
  isOpen = false;
  isAuthenticated: any = false;
  plusIcon = faPlus;

  constructor(
    private authService: AuthService,
    private channelService: ChannelService,
    private alertsService: AlertsService,
    private utilsService: UtilsService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createFormGroup();
    if (localStorage.getItem('token') != undefined) {
      this.authService.isLoggedIn();
      this.isAuthenticated = true;
    }
  }

  // Form to create a channel including validators and asynchronous validators for each field.
  createFormGroup() {
    this.channelForm = this.fb.group({
      name: [
        '',
        {
          validators: [Validators.required, Validators.minLength(1)],
          asyncValidators: [channeltitleValidator(this.channelService)],
          updateOn: 'blur',
        },
      ],
      channelName: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(1),
            Validators.pattern('^[a-zA-Z0-9_]+$'),
          ],
          asyncValidators: [channelnameValidator(this.channelService)],
          updateOn: 'blur',
        },
      ],
      backgroundImage: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  onChange($event: Event) {
    this.utilsService.onChange($event);
  };

  // Create channel and redirect to created channel on submiting the form
  onSubmit(formData:any) :void {
    this.channelService.createChannel(formData)
    .pipe(
      first()
    ).subscribe((data) => {
      this.create.emit(null);
      if (data != undefined) {
        this.alertsService.sweetAlertSuccess('New channel successfully created!', 'Start posting!');
      } else {
        this.alertsService.sweetAlertError('Something went wrong!', 'Error when creating the channel, please try again.');
      }
    })
    this.channelForm.reset();
    this.formDirective.reset();
  }
}
