import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../shared/email-validator';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
  });

  signupError;

  constructor(private fb: FormBuilder, private trinityLyfeService: TrinityLyfeService, private router: Router) { }

  ngOnInit() {
    this.setValidators();   
  }


  onSubmit() {
    var formData: any = new FormData();
    formData.append('name', this.signupForm.get('name').value);
    formData.append('username', this.signupForm.get('username').value);
    formData.append('email', this.signupForm.get('email').value);
    formData.append('password', this.signupForm.get('password').value);

    this.trinityLyfeService.postAPIData('signup', formData, true).subscribe((resp: any) => {
      this.router.navigate(['/login']);
    }, (errorResp) => {
      if(errorResp.status == 409) {
        this.signupError = "User already exists! Try logging in instead";
      }
      else {
        this.signupError = "Something went wrong! Please try again later"
      }
    });
    
  }

  get name() { return this.signupForm.get('name'); }
  get username() { return this.signupForm.get('username'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  private setValidators() {
    this.signupForm.get('confirmPassword').setValidators(PasswordValidator.checkPasswords(this.signupForm.get('password'), this.signupForm.get('confirmPassword')));
  }

}
