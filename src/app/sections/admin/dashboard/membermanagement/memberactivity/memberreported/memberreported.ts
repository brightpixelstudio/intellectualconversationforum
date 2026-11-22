import { Component, Input } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { GetReported } from '../../../../../../models/reported/getreported';
import { Router } from '@angular/router';

@Component({
  selector: 'memberreported',
  imports: [DatePipe, JsonPipe],
  templateUrl: './memberreported.html',
  styleUrl: './memberreported.css',
})
export class MemberReported {
  @Input({ required: true }) reported!: GetReported[];

  constructor(private router: Router) {}

  selectNotification(reported: GetReported): void {
    this.router.navigate(['/post'], {
      queryParams: {
        postguid: reported.postguid,
        postcommentid: reported.postcommentid,
      },
    });
  }
}
