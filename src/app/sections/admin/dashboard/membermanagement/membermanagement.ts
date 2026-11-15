import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { MemberSearchComponent } from './membersearch/membersearch';
import { MemberProfile } from './memberprofile/memberprofile';
import { MemberUpdate } from './memberupdate/memberupdate';
import { MemberActivity } from './memberactivity/memberactivity';
import { ApiServiceUser } from '../../../../services/userservice';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'membermanagement',
  imports: [MemberSearchComponent, MemberProfile, MemberUpdate, MemberActivity],
  templateUrl: './membermanagement.html',
  styleUrl: './membermanagement.css',
})
export class MemberManagement {
  selectedUserGuid: string | null = null;
  getUserProfile: any = null;
  canUpdate = false;
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private apiServiceUser: ApiServiceUser,
    private authService: AuthService,
  ) {}

  loadMemberProfile(userguid: string, userid: number): void {
    this.selectedUserGuid = userguid;
    this.getUserProfile = null;

    this.apiServiceUser.getUserProfileStatistics(userguid, userid, 200).subscribe({
      next: (data) => {
        this.getUserProfile = data;

        const loggedInUserGuid = this.authService.getUserGuid();
        const profileGuid = data?.getPostsMember?.[0]?.userguid;

        this.canUpdate =
          !!loggedInUserGuid &&
          !!profileGuid &&
          profileGuid.trim().toLowerCase() === loggedInUserGuid.trim().toLowerCase();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Unable to load member profile:', err);
      },
    });
  }
}
