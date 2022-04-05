import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../shared/email-validator';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  

  constructor(private fb: FormBuilder, private router: Router, private trinityLyfeService: TrinityLyfeService) { }

  isLoggedIn;
  user;
  updateError;

  passwordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
  });

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.user = localStorage.getItem("user");
    if(this.isLoggedIn == "false") {
      this.router.navigate(['/login']);
    }
    this.setValidators();
  }

  onSubmit() {
    let formData = new FormData();
    formData.append("newPassword", this.passwordForm.get('password').value);
    formData.append("username", this.user);
    this.trinityLyfeService.postAPIData("user", formData, true).subscribe((resp: any) => {
      this.router.navigate(['/profile/'+this.user,]);
    },
    (errorResp) => {
      if(errorResp.status == 401) {
        this.updateError = "You are authorised to perform the operation!";
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("user");
        this.router.navigate(['/login']);
      }
      else {
        this.updateError = "Something went wrong! Please try again later"
      }
    })
  }

  private setValidators() {
    this.passwordForm.get('confirmPassword').setValidators(PasswordValidator.checkPasswords(this.passwordForm.get('password'), this.passwordForm.get('confirmPassword')));
  }
}
