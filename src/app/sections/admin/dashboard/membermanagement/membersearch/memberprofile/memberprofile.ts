import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUser } from '../../../../../../services/userservice';
import { DatePipe } from '@angular/common';
import { MemberRecentPosts } from './memberrecentposts/memberrecentposts';
import { MemberRecentComments } from './memberrecentcomments/memberrecentcomments';
import { MemberPostRatings } from './memberpostratings/memberpostratings';
import { MemberCommentRatings } from './membercommentratings/membercommentratings';

@Component({
  selector: 'memberprofile',
  imports: [
    MemberRecentPosts,
    MemberRecentComments,
    MemberPostRatings,
    MemberCommentRatings,
    DatePipe,
  ],
  templateUrl: './memberprofile.html',
  styleUrl: './memberprofile.css',
})
export class MemberProfile implements OnInit {
  @Input({ required: true }) userguid!: string;

  getUserProfile: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMemberProfile();
  }

  loadMemberProfile(): void {
    this.loading = true;

    this.apiServiceUser.getUserProfileStatistics(this.userguid).subscribe({
      next: (data) => {
        this.getUserProfile = data;
        this.loading = false;
        this.cdr.detectChanges();

        console.log(this.getUserProfile);
      },
      error: (err) => {
        console.error('Unable to load member profile:', err);
        this.errorMessage = 'Unable to load member profile.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
