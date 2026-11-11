import { Component } from '@angular/core';
import { MemberSearchComponent } from '../membersearch/membersearch';

@Component({
  selector: 'dashboard',
  imports: [MemberSearchComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  loadMemberProfile(userguid: string): void {
    console.log('Selected member:', userguid);
  }
}
