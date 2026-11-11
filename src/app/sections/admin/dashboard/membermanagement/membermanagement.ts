import { Component } from '@angular/core';
import { MemberSearchComponent } from './membersearch/membersearch';

@Component({
  selector: 'membermanagement',
  imports: [MemberSearchComponent],
  templateUrl: './membermanagement.html',
  styleUrl: './membermanagement.css',
})
export class MemberManagement {
  loadMemberProfile(userguid: string): void {
    console.log('Selected member:', userguid);
  }
}
