import { Component, Input } from '@angular/core';
import { MemberRecentPosts } from '../memberactivity/memberrecentposts/memberrecentposts';
import { MemberRecentComments } from '../memberactivity/memberrecentcomments/memberrecentcomments';
import { MemberPostRatings } from '../memberactivity/memberpostratings/memberpostratings';
import { MemberCommentRatings } from '../memberactivity/membercommentratings/membercommentratings';
import { MemberAccountStatusHistory } from '../memberactivity/memberaccountstatushistory/memberaccountstatushistory';
import { MemberNotifications } from '../memberactivity/membernotifications/membernotifications';

@Component({
  selector: 'memberactivity',
  imports: [
    MemberRecentPosts,
    MemberRecentComments,
    MemberPostRatings,
    MemberCommentRatings,
    MemberAccountStatusHistory,
    MemberNotifications,
  ],
  templateUrl: './memberactivity.html',
  styleUrl: './memberactivity.css',
})
export class MemberActivity {
  @Input({ required: true }) memberProfile!: any;
}
