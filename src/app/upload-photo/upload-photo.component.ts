import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit {

  constructor(private authService: AuthService, private fb: FormBuilder, private trinityLyfeService: TrinityLyfeService, private router: Router) { }

  postUploadForm = this.fb.group({
    caption: [''],
    photoFile: ['', Validators.required],
    photoFileSource: ['', Validators.required],
  });

  isLoggedIn;
  user;
  selectedFile;
  uploadError;

  get postUploadFormControls() {
    return this.postUploadForm.controls;
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.postUploadForm.get('photoFileSource').setValue(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgBase64Path = e.target.result;
        this.selectedFile = imgBase64Path;
      }
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.user = localStorage.getItem("user");
    if(this.isLoggedIn == "false") {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    var formData: any = new FormData();
    var file = this.postUploadForm.get('photoFileSource').value;
    var caption = this.postUploadForm.get('caption').value;
    formData.append('caption', caption);
    formData.append('file', file);
    formData.append('username', this.user);
    this.trinityLyfeService.postAPIData('photo' , formData, true).subscribe((resp: any) => {
      this.router.navigate(['/landing-page']);
    }, (errorResp) => {
      if(errorResp.status == 401) {
        this.uploadError = "You are authorised to perform the operation!";
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("user");
        this.router.navigate(['/login']);
      }
      else {
        this.uploadError = "Something went wrong! Please try again later"
      }
    });
  }
}
