import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

export interface Item {
  name: string;
}

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent implements OnInit {
  user: User={
    id: 0,
    name: '',
    email: '',
    isAdmin: false,
    profilePicture: ''
  }
  isAdmin: boolean | undefined = false;
  

  constructor(private userService: UserService, private authService: AuthService, private utils: UtilsService, private router: Router) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');

    if (token != undefined) {
      const decodedToken = helper.decodeToken(token);
      const expirationDate = helper.getTokenExpirationDate(token);
      const isExpired = helper.isTokenExpired(token);
      // console.log(decodedToken);
      // console.log(expirationDate);
      // console.log(isExpired);
      if (!isExpired) {
        this.authService.isLoggedIn();
      }

      const userData = this.utils.getDataFromToken();
      if (userData !== undefined) {
        this.isAdmin = userData.isAdmin;
      }
      
    } else {
      this.router.navigate(['/'])
    }
    this.userService.getUserInfo().subscribe((user) => {
      console.log("user picture: "+user.profilePicture)
      this.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
      };
    })
  }
}

