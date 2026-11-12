import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'memberrecentcomments',
  imports: [DatePipe],
  templateUrl: './memberrecentcomments.html',
  styleUrl: './memberrecentcomments.css',
})
export class MemberRecentComments {
  @Input({ required: true }) comments!: any[];
}
