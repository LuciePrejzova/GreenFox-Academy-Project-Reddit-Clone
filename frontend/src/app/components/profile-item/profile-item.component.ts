import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/interfaces/User';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { first, Observable, Subscriber } from 'rxjs';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @ViewChild('formDirective') formDirective!: NgForm;
  @Input() user!: User;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  pictureForm!: FormGroup;
  content!: any;
  isOpen = false;
  isOpenPswd = false;
  isToggled = false;
  title = 'imgtobase64';
  base64code!: any;

  faCamera = faCamera;
  faUser = faUser;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.emailForm = this.createFormGroup();
    this.passwordForm = this.createPswdFormGroup();
    this.pictureForm = this.createPictureFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  createPictureFormGroup(): FormGroup {
    return new FormGroup({
      profilePicture: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  createPswdFormGroup(): FormGroup {
    return new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password_repeat: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSubmit(formData: any): void {
    this.userService
      .updateUserInfo(formData, this.base64code)
      .pipe(first())
      .subscribe((message: any) => {
        console.log('xxxxxxxxx' + message);
        this.user.email = formData.email;
        this.isOpen = false;
        this.isOpenPswd = false;
        this.isToggled = false;
      });
    this.emailForm.reset();
    this.formDirective.reset();
  }

  onChange = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log('onChange ' + file);
    this.convertToBase64(file);
  };

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    observable.subscribe((d) => {
      console.log('convert to base 64 ' + d);
      this.base64code = d;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = (event: any) => {
      //will change the profile picture imediately
      this.user.profilePicture = event.target.result;
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }
}
