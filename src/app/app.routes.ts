import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
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

export const routes: Routes = [
  { path: '', component: Home, title: 'Registration' },
  { path: 'members', component: MembersPage, title: 'Members' },
  { path: 'editprofile', component: EditProfilePage, title: 'Edit Profile' },
  { path: 'memberstatistics', component: MemberStatisticsPage, title: 'View Member Statistics' },
  { path: 'statistics', component: StatisticsPage, title: 'View Statistics' },
  { path: 'posts', component: PostsPage, title: 'Posts' },
  { path: 'newpost', component: NewPostPage, title: 'New Post' },
  { path: 'newcomment', component: NewCommentPage, title: 'New Comment' },
  { path: 'editpost', component: EditPostPage, title: 'Edit Post' },
  { path: 'editcomment', component: EditCommentPage, title: 'Edit Comment' },
  { path: 'post', component: PostPage, title: 'View Full Post' },
];
