import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MemberRecentPosts } from '../memberactivity/memberrecentposts/memberrecentposts';
import { MemberRecentComments } from '../memberactivity/memberrecentcomments/memberrecentcomments';
import { MemberPostRatings } from '../memberactivity/memberpostratings/memberpostratings';
import { MemberCommentRatings } from '../memberactivity/membercommentratings/membercommentratings';
import { MemberAccountStatusHistory } from '../memberactivity/memberaccountstatushistory/memberaccountstatushistory';
import { MemberNotifications } from '../memberactivity/membernotifications/membernotifications';
import { AuthService } from '../../../../../services/auth';

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
export class MemberActivity implements OnChanges {
  @Input({ required: true }) memberProfile!: any;
  @Input() isAdmin = false;

  canUpdate = false;

  constructor(private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['memberProfile']) {
      const loggedInUserGuid = this.authService.getUserGuid();

      const profileGuid = this.memberProfile?.getPostsMember?.[0]?.userguid;

      this.canUpdate =
        !!loggedInUserGuid &&
        !!profileGuid &&
        profileGuid.trim().toLowerCase() === loggedInUserGuid.trim().toLowerCase();
    }
  }
}
