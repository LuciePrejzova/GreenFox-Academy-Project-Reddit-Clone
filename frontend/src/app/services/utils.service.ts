import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  title = 'imgtobase64';
  myimage!: Observable<any>;
  base64code!: any;

  constructor(private sanitizer: DomSanitizer) {}

  getDataFromToken(): Partial<User> {
    let response = {};
    let user: User;
    const optionalToken = localStorage.getItem('token');
    let splitTokenString = '';

    if (optionalToken) {
      splitTokenString = atob(optionalToken.split('.')[1]);
    }

    user = JSON.parse(splitTokenString);

    return (response = { id: user.id, name: user.name, isAdmin: user.isAdmin });
  }

  formatDateTime(datetime: string) {
    const [date, time] = datetime.split('T');
    return [
      // input: "2022-05-19T06:44:26.000Z"
      date.split('-').join('/'), // result -> "2022/05/19"
      time.split('.')[0], // 06:44:26
    ];
  }

  convertBase64ToImage(base64String: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
  }

  sanitize(value: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  // Triger conversion on uploading file
  onChange = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.convertToBase64(file)
  };

  // Convert input file to base64
  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });

    observable.subscribe((d) => {
      this.myimage = d
      this.base64code = d
    })
  }

  // Read input file
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

}
