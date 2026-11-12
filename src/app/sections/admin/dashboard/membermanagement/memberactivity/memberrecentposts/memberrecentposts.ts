import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'memberrecentposts',
  imports: [DatePipe],
  templateUrl: './memberrecentposts.html',
  styleUrl: './memberrecentposts.css',
})
export class MemberRecentPosts {
  @Input({ required: true }) posts!: any[];
}
