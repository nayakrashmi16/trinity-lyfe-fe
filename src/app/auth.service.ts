import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TrinityLyfeService } from './trinity-lyfe.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  doLogin(formData: FormData) {
    return this.trinityLyfeService.postAPIData('login' , formData, true);
  }

  getLogin() {
    return this.trinityLyfeService.getAPIData('/login', true);
  }

  doLogout() {
    return this.trinityLyfeService.postAPIData('/logout', true);
  }

  constructor(private trinityLyfeService: TrinityLyfeService) {
  }
}
