import { Component, Input } from '@angular/core';
import { MemberRecentPosts } from '../memberactivity/memberrecentposts/memberrecentposts';
import { MemberRecentComments } from '../memberactivity/memberrecentcomments/memberrecentcomments';
import { MemberPostRatings } from '../memberactivity/memberpostratings/memberpostratings';
import { MemberCommentRatings } from '../memberactivity/membercommentratings/membercommentratings';
import { MemberProfile } from '../memberprofile/memberprofile';

@Component({
  selector: 'memberactivity',
  imports: [MemberRecentPosts, MemberRecentComments, MemberPostRatings, MemberCommentRatings],
  templateUrl: './memberactivity.html',
  styleUrl: './memberactivity.css',
})
export class MemberActivity {
  @Input({ required: true }) memberProfile!: any;
}
