import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'memberpostratings',
  imports: [DatePipe],
  templateUrl: './memberpostratings.html',
  styleUrl: './memberpostratings.css',
})
export class MemberPostRatings {
  @Input({ required: true }) postRatings!: any[];
}
