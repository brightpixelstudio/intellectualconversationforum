import { Component, Input } from '@angular/core';

@Component({
  selector: 'memberrecentposts',
  imports: [],
  templateUrl: './memberrecentposts.html',
  styleUrl: './memberrecentposts.css',
})
export class MemberRecentPosts {
  @Input({ required: true }) posts!: any[];
}
