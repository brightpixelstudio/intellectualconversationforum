import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'membercommentratings',
  imports: [DatePipe],
  templateUrl: './membercommentratings.html',
  styleUrl: './membercommentratings.css',
})
export class MemberCommentRatings {
  @Input({ required: true }) commentRatings!: any[];
}
