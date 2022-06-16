import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  isAuthenticated = false;
  isAdmin: any = false;

  message = '';

  constructor(private authService: AuthService, private utils: UtilsService) {}

  ngOnInit(): void {

    // Set token when landing on homepage
    const helper = new JwtHelperService();
    const token = localStorage.getItem("token");
    if (token != undefined) {
      const isExpired = helper.isTokenExpired(token);
      if (!isExpired) {
        this.authService.isLoggedIn();
      }

      const userData = this.utils.getDataFromToken();
      if (userData !== undefined) {
        this.isAdmin = userData.isAdmin;
      }

    }
    console.log("is admin: " + this.isAdmin)
  }
}
