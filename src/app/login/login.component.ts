import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Router} from "@angular/router"
import { TrinityLyfeService } from '../trinity-lyfe.service';
import { TouchSequence } from 'selenium-webdriver';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loggedIn;

  loginError;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
  }

  ngOnInit() {
    if(localStorage.getItem("isLoggedIn") == "true") {
      this.router.navigate(['/landing-page']);
    }
  }

  onSubmit() {
    var formData: any = new FormData();
    formData.append('username', this.loginForm.get('username').value);
    formData.append('password', this.loginForm.get('password').value);
    this.authService.doLogin(formData).subscribe((resp: any) => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", resp.results.user);
      this.router.navigate(['/landing-page']);
    }, (errorResp) => {
      localStorage.setItem("isLoggedIn", "false");
      if(errorResp.status == 401) {
        this.loginError = "Please verify your username & password and try again";
      }
      else {
        this.loginError = "Something went wrong! Please try again later"
      }
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

}
