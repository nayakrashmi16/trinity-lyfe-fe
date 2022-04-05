import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  isLoggedIn;
  user;

  postId;
  postDetail;

  error;

  commentForm = this.fb.group({
    comment: ['', Validators.required],
  });

  get comment() {
    return this.comment.get('comment');
  }

  constructor(private router: Router, private route: ActivatedRoute, private trinityLyfeService: TrinityLyfeService, private fb: FormBuilder) { }

  ngOnInit() {

    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.user = localStorage.getItem("user");

    if(this.isLoggedIn === 'false') {
      this.commentForm.controls['comment'].disable();
    }

    this.postDetail = {};

    this.route.params.subscribe((params) => {
      this.postId = params['post_id'];
      this.getPostDetails();
      this.getLikesForPost();
      this.getCommentsForPost();
    });
  }

  getPostDetails() {
    this.trinityLyfeService.getAPIData("photo/" + this.postId, true).subscribe((resp: any) => {
      let results = resp.results.posts;
      if (results.length !== 0) {
        let post = results[0];
        this.postDetail["postId"] = post["post_id"];
        this.postDetail["username"] = post["username"];
        this.postDetail["src"] = "data:image/jpeg;base64," + post["post_img_path"];
        this.postDetail["caption"] = post["caption"];
        this.postDetail["date"] = new Date(post["created_at"]).toLocaleDateString("en-US");
      }
    },
    (errorResp) => {
        if(errorResp.status === 404) {
          this.router.navigate(['/page-not-found']);
        }
        else {
          
        }
    });
  }

  getLikesForPost() {
    this.trinityLyfeService.getAPIData("like/" + this.postId, true).subscribe((resp: any) => {
      this.postDetail["likes"] = resp.results.likes;
      this.postDetail["likesCount"] = this.postDetail["likes"].length;
      this.postDetail["likedByCurrentUser"] = this.postDetail["likes"].filter((likeObject) => {
        return likeObject.username === this.user;
      }).length === 1 ? true : false;
    },
    (errorResp) => {
        this.error = "Something went wrong! Please try again later";
    });
  }

  getCommentsForPost() {
    this.trinityLyfeService.getAPIData("comment/" + this.postId, true).subscribe((resp: any) => {
      this.postDetail["comments"] = resp.results.comments;
      this.postDetail["commentsCount"] = this.postDetail["comments"].length;
    },
    (errorResp) => {
        this.error = "Something went wrong! Please try again later";
    })
  }

  toggleLike() {
    if (this.postDetail["likedByCurrentUser"]) {
      let likeId = this.postDetail["likes"].filter((likeObject) => {
        return likeObject.username === this.user;
      })[0].like_id;
      this.trinityLyfeService.deleteAPIData("like/" + likeId, true).subscribe((resp: any) => {
        this.getLikesForPost();
      },
        (errorResp) => {
          if(errorResp.status == 401) {
            this.error = "You are authorised to perform the operation!";
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("user");
            this.router.navigate(['/login']);
          }
          else {
            this.error = "Something went wrong! Please try again later";
          }
        });
    }
    else {
      var formData: FormData = new FormData();
      formData.append("postId", this.postDetail["postId"]);
      formData.append("username", this.user);
      this.trinityLyfeService.postAPIData("like", formData, true).subscribe((resp: any) => {
        this.getLikesForPost();
      },
        (errorResp) => {
          if(errorResp.status == 401) {
            this.error = "You are authorised to perform the operation!";
            localStorage.setItem("isLoggedIn", "false");
            localStorage.removeItem("user");
            this.router.navigate(['/login']);
          }
          else {
            this.error = "Something went wrong! Please try again later";
          }
        });
    }
  }

  postComment() {
    if (this.commentForm.valid) {
      let comment = this.commentForm.get('comment').value;
      let formData: FormData = new FormData();
      formData.append('username', this.user);
      formData.append('postId', this.postId);
      formData.append('comment', comment);

      this.trinityLyfeService.postAPIData("comment", formData, true).subscribe((res: any) => {
        this.getCommentsForPost();
        this.commentForm.get('comment').reset('');
      },
      (errorResp) => {
        if(errorResp.status == 401) {
          this.error = "You are authorised to perform the operation!";
          localStorage.setItem("isLoggedIn", "false");
          localStorage.removeItem("user");
          this.router.navigate(['/login']);
        }
        else {
          this.error = "Something went wrong! Please try again later";
        }
      });
    }
  }
}
