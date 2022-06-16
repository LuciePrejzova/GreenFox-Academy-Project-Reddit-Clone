import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertService: AlertsService) { }

  ngOnInit(): void {
    this.createFormGroup();
  };

  // Login form including validators and asynchronous validators for each field.
  createFormGroup() {
    this.loginForm = this.fb.group({
      name: ["", {
        validators: [
          Validators.required,
          Validators.minLength(1)
        ]
      }],
      password: ["", [
        Validators.required,
        Validators.minLength(1),
      ]]
    })
  }

  login() {
    this.authService.login(this.loginForm.value.name, this.loginForm.value.email, this.loginForm.value.password)
    .subscribe(data => {
      if (data == undefined) {
        this.alertService.sweetAlertError('Login unsuccessful!', 'Please make sure your are providing matching credentials and that your account is activated.');
      } else {
        this.alertService.sweetAlertSuccess('Login successful!', 'Enjoy!');
      };
    });
  };

}
