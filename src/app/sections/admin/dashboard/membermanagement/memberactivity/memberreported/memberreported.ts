import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GetReported } from '../../../../../../models/reported/getreported';
import { Router } from '@angular/router';

@Component({
  selector: 'memberreported',
  imports: [DatePipe],
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
