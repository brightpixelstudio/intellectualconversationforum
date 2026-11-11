import { Component, Input } from '@angular/core';

@Component({
  selector: 'memberrecentcomments',
  imports: [],
  templateUrl: './memberrecentcomments.html',
  styleUrl: './memberrecentcomments.css',
})
export class MemberRecentComments {
  @Input({ required: true }) comments!: any[];
}
