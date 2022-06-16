import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Post } from 'src/app/interfaces/Post';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  @Input() channelId!: number;
  @Output() onAddPost: EventEmitter<Post> = new EventEmitter();

  isOpen = false;
  isAuthenticated = false;
  title!: '';
  content: string = '';
  type: 'text' | 'image' | 'link' = 'text';

  constructor(
    private authService: AuthService
  ) {}

  displayFormFor(formType: 'text' | 'image' | 'link') {
    this.type = formType;
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') != undefined) {
      this.authService.isLoggedIn();
      this.isAuthenticated = true;
    }
  }

  onChange = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.convertToBase64(file);
  };

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    observable.subscribe((d) => {
      this.content = d;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  onSubmit(submittedForm: any) {
    if (submittedForm.invalid) {
      return;

    } else {
      const newPost = {
        title: this.title,
        type: this.type,
        content: this.content,
        channel_id: this.channelId,
      };

      this.onAddPost.emit(newPost);
      this.setFieldsToDefaults();
    }
  }

  private setFieldsToDefaults() {
    this.title = '';
    this.content = '';
    this.isOpen = false;
  }
}
