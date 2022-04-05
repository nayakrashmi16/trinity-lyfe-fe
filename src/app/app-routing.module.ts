import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SignupComponent } from './signup/signup.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';


const routes: Routes = [
  { path: '',   redirectTo: '/landing-page', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'post/:post_id', component: PostDetailComponent },
  { path: 'upload-photo', component: UploadPhotoComponent, canActivate : [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate : [AuthGuard] },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'search-results/:search_term', component: SearchResultsComponent },
  { path: '**', pathMatch: 'full',  component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
