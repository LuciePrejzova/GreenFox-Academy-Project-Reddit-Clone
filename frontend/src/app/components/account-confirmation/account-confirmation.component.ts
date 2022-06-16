import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['./account-confirmation.component.scss']
})
export class AccountConfirmationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertsService) { }

  ngOnInit(): void {
    // Extracting activation token from uri:
    const activationToken = this.router.url.split('/')[2]
    // When landing on page, alert pops up.
    this.authService.accountValidation(activationToken).subscribe(() => {
      this.alertService.sweetAlertSuccess('Account activated!', 'You can now login.');
      // Redirecting to login
      this.router.navigate(['/login']);
    }, (error) => {
      this.alertService.sweetAlertError('Error!', error.error[Object.keys(error.error)[0]]);
    })
  }

}
