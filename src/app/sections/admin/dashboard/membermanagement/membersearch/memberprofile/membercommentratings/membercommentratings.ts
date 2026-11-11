import { Component, Input } from '@angular/core';

@Component({
  selector: 'membercommentratings',
  imports: [],
  templateUrl: './membercommentratings.html',
  styleUrl: './membercommentratings.css',
})
export class MemberCommentRatings {
  @Input({ required: true }) commentRatings!: any[];
}
