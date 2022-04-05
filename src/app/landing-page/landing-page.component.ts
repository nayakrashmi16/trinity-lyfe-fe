import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  isLoggedIn;
  user;
  postDetailArray = [];
  error;

  searchForm = this.fb.group({
    searchValue: ['', Validators.required]
  })


  constructor(private router: Router, private trinityLyfeService: TrinityLyfeService, private fb: FormBuilder) { }

  ngOnInit() {
    // this.isLoggedIn = localStorage.getItem("isLoggedIn");
    // this.user = localStorage.getItem("user");
    // if(this.isLoggedIn == "false") {
    //   this.router.navigate(['/login']);
    // }

    this.getPostDetails();
  }

  getPostDetails() {
    this.trinityLyfeService.getAPIData("photo", true).subscribe((resp: any) => {
      let postResultArray = resp.results.posts;
      this.postDetailArray = [];
      for(let index in postResultArray) {
        let postResult = postResultArray[index];
        let postDetail = {};
        postDetail["post_id"] = postResult["post_id"];
       
        this.trinityLyfeService.getAPIData("like/"+postDetail["post_id"], true).subscribe((resp: any) => {
          postDetail["likesCount"] = resp.results.likes.length;
        },
        (errorResp) => {
          console.log(errorResp);
        });

        this.trinityLyfeService.getAPIData("comment/"+postDetail["post_id"], true).subscribe((resp: any) => {
          postDetail["commentsCount"] = resp.results.comments.length;
        },
        (errorResp) => {
          console.log(errorResp);
        });

        postDetail["src"] = "data:image/jpeg;base64,"+postResult["post_img_path"];
        this.postDetailArray.push(postDetail);
      }
    }, 
    (errorResp) => {
      if(errorResp.status !== 404) {
        this.error = "Something went wrong! Please try again later";
      }
    });
  }

  onSubmit() {
    let searchTerm = this.searchForm.get('searchValue').value;
    this.router.navigate(['/search-results', searchTerm ]);
  }

}
