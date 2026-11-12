import { Component } from '@angular/core';
import { MemberSearchComponent } from './membersearch/membersearch';
import { MemberProfile } from './memberprofile/memberprofile';
import { MemberUpdate } from './memberupdate/memberupdate';
import { MemberActivity } from './memberactivity/memberactivity';
import { ApiServiceUser } from '../../../../services/userservice';

@Component({
  selector: 'membermanagement',
  imports: [MemberSearchComponent, MemberProfile, MemberUpdate, MemberActivity],
  templateUrl: './membermanagement.html',
  styleUrl: './membermanagement.css',
})
export class MemberManagement {
  selectedUserGuid: string | null = null;
  getUserProfile: any = null;

  constructor(private apiServiceUser: ApiServiceUser) {}

  loadMemberProfile(userguid: string): void {
    this.selectedUserGuid = userguid;
    this.getUserProfile = null;

    this.apiServiceUser.getUserProfileStatistics(userguid).subscribe({
      next: (data) => {
        this.getUserProfile = data;
      },
      error: (err) => {
        console.error('Unable to load member profile:', err);
      },
    });
  }
}
