import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { RegistrationPage } from './pages/registration/registrationpage';
import { MembersPage } from './pages/members/members';
import { EditProfilePage } from './pages/editprofile/editprofilepage';
import { MemberStatisticsPage } from './pages/memberstatistics/memberstatistics';
import { StatisticsPage } from './pages/statistics/statisticspage';
import { PostsPage } from './pages/posts/postspage';
import { NewPostPage } from './pages/newpost/newpostpage';
import { NewCommentPage } from './pages/newcomment/newcommentpage';
import { EditPostPage } from './pages/editpost/editpostpage';
import { EditCommentPage } from './pages/editcomment/editcommentpage';
import { PostPage } from './pages/post/posttpage';
import { LoginPage } from './pages/login/login';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: LoginPage,
    title: 'Login',
  },
  {
    path: 'registration',
    component: RegistrationPage,
    title: 'Registration',
  },

  // Protected routes
  {
    path: 'members',
    component: MembersPage,
    title: 'Members',
    canActivate: [authGuard],
  },
  {
    path: 'editprofile',
    component: EditProfilePage,
    title: 'Edit Profile',
    canActivate: [authGuard],
  },
  {
    path: 'memberstatistics',
    component: MemberStatisticsPage,
    title: 'View Member Statistics',
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    component: StatisticsPage,
    title: 'View Statistics',
    canActivate: [authGuard],
  },
  {
    path: 'posts',
    component: PostsPage,
    title: 'Posts',
    canActivate: [authGuard],
  },
  {
    path: 'newpost',
    component: NewPostPage,
    title: 'New Post',
    canActivate: [authGuard],
  },
  {
    path: 'newcomment',
    component: NewCommentPage,
    title: 'New Comment',
    canActivate: [authGuard],
  },
  {
    path: 'editpost',
    component: EditPostPage,
    title: 'Edit Post',
    canActivate: [authGuard],
  },
  {
    path: 'editcomment',
    component: EditCommentPage,
    title: 'Edit Comment',
    canActivate: [authGuard],
  },
  {
    path: 'post',
    component: PostPage,
    title: 'View Full Post',
    canActivate: [authGuard],
  },
];
