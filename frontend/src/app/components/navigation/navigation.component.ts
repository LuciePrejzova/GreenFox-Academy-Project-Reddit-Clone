import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isAuthenticated = false;
  faMagnifyingGlassIcon = faMagnifyingGlass;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    })
  }

  logout(): void {
    localStorage.removeItem("token");
    this.authService.isUserLoggedIn$.next(false);
    this.router.navigate(["login"]);
  }


}
