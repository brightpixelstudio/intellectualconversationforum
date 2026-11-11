import { Component } from '@angular/core';
import { MemberSearchComponent } from './membersearch/membersearch';
import { MemberProfile } from './membersearch/memberprofile/memberprofile';

@Component({
  selector: 'membermanagement',
  imports: [MemberSearchComponent, MemberProfile],
  templateUrl: './membermanagement.html',
  styleUrl: './membermanagement.css',
})
export class MemberManagement {
  selectedUserGuid: string | null = null;

  loadMemberProfile(userguid: string): void {
    this.selectedUserGuid = userguid;
  }
}
