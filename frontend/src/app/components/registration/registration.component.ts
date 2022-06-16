import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { usernameValidator, emailValidator } from 'src/app/validators/user.validator';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {
  signupForm!: FormGroup;
  userName!: any;

  constructor(
    private authService: AuthService,
    private alertsService: AlertsService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  // Registration form including validators and asynchronous validators for each field.
  createFormGroup() {
    this.signupForm = this.fb.group({
      name: ["", {
        validators: [
          Validators.required,
          Validators.minLength(2)
        ],
        asyncValidators: [usernameValidator(this.authService)],
        updateOn: 'blur'
      }],
      email: ["", {
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: [emailValidator(this.authService)],
        updateOn: 'blur'
      }],
      password: ["", [
        Validators.required,
        Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$') ]],
      password_repeat: ['']
    }, { validators: this.checkPasswords })
  }

  // Check whether password and confirmation password are identical
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('password_repeat')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  signup() {
    this.authService.signup(this.signupForm.value).subscribe(data => {
      if (data == undefined) {
        this.alertsService.sweetAlertError('Registration unsuccessful!', 'Please try again.');
      } else {
        this.alertsService.sweetAlertSuccess('Registration successful!', 'Please check your email to validate your account.');
      };
    });
  }

}
