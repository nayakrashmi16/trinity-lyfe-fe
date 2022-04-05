import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLoggedIn;

  user;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = (localStorage.getItem("isLoggedIn") === null ? "false" : localStorage.getItem("isLoggedIn"));
    this.user = localStorage.getItem("user");
  }

  logout() {
    this.authService.doLogout().subscribe((resp: any) => {
      localStorage.setItem("isLoggedIn", resp.results.loggedIn);
      this.isLoggedIn = resp.results.loggedIn.toString();
      this.router.navigate(["/"]);
    }, (errorResp) => {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("user");
      this.isLoggedIn = "false";
      this.router.navigate(["/"]);
    });
  }
}
