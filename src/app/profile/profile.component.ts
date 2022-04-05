import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isLoggedIn;
  user;
  postDetailArray = [];
  profileUser;
  profileUserName;
  profilePostCount = 0;

  constructor(private router: Router, private trinityLyfeService: TrinityLyfeService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.user = localStorage.getItem("user");
    console.log(this.isLoggedIn);
   
    if(this.isLoggedIn == "false") {
      this.router.navigate(['/login']);
    }

    this.route.params.subscribe((params) => {
      this.profileUser = params.username;
      this.getUserDetails();
      this.getPostDetails();
    });
  }

  getUserDetails() {
    this.trinityLyfeService.getAPIData("user/"+this.profileUser, true).subscribe((resp: any) => {
      this.profileUserName = resp.results["name"];
    },
    (errorResp) => {
      if(errorResp.status === 404) {
        this.router.navigate(['/page-not-found']);
      }
    })
  }

  getPostDetails() {
    this.trinityLyfeService.getAPIData("photo?username="+this.profileUser, true).subscribe((resp: any) => {
      let postResultArray = resp.results.posts;
      this.postDetailArray = [];
      for(let index in postResultArray) {
        let postResult = postResultArray[index];
        let postDetail = {};
        postDetail["post_id"] = postResult["post_id"];
        postDetail["src"] = "data:image/jpeg;base64,"+postResult["post_img_path"];

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

        this.postDetailArray.push(postDetail);
      }

      this.profilePostCount = this.postDetailArray.length;
    }, 
    (errorResp) => {
    });
  }
}
