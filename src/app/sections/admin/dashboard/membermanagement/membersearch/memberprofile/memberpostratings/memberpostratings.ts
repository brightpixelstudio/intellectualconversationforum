import { Component, Input } from '@angular/core';

@Component({
  selector: 'memberpostratings',
  imports: [],
  templateUrl: './memberpostratings.html',
  styleUrl: './memberpostratings.css',
})
export class MemberPostRatings {
  @Input({ required: true }) postRatings!: any[];
}
