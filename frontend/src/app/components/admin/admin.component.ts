import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @Input() user!: User;
  userForm!: FormGroup;
  isOpen:boolean = false;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      password_repeat: new FormControl("", [Validators.required, Validators.minLength(8)])
    })
  }

  newUser(): void {
    this.authService.signup(this.userForm.value).subscribe((msg) => console.log(msg));
    this.router.navigate(["login"]).then(nav => {
      window.alert('Successfully registered user');
   }, err => {
     console.log(err) // when there's an error
   });
  }

}
