import { Component, Input } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
@Component({
  selector: 'membercommentratings',
  imports: [DatePipe, JsonPipe],
  templateUrl: './membercommentratings.html',
  styleUrl: './membercommentratings.css',
})
export class MemberCommentRatings {
  @Input({ required: true }) commentRatings!: any[];
}
