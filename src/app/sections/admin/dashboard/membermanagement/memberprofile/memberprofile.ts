import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'memberprofile',
  imports: [DatePipe, JsonPipe],
  templateUrl: './memberprofile.html',
  styleUrl: './memberprofile.css',
})
export class MemberProfile implements OnChanges {
  @Input({ required: true }) getUserProfile: any = null;
  @Input({ required: true }) isAdmin: boolean = false;
  @Input({ required: true }) canUpdate = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['getUserProfile'] && this.getUserProfile) {
      // Update any local properties needed for displaying the profile.
    }
  }
}
