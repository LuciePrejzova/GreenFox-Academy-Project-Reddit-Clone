import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  // Success alert
  sweetAlertSuccess(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0079d3'
    });
  }

  // Error alert
  sweetAlertError(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0079d3'
    });
  }
}
