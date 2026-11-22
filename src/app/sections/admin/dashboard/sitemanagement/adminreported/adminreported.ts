import { Component, ChangeDetectorRef } from '@angular/core';
import { GetReported } from './../../../../../models/reported/getreported';
import { FormsModule } from '@angular/forms';
import { ApiServiceReported } from '../../../../../services/reportedservice';
import { GlobalService } from '../../../../../services/globalservice';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GetReportedAdmin } from '../../../../../models/reported/getreportedadmin';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'adminreported',
  imports: [FormsModule, DatePipe, FontAwesomeModule],
  templateUrl: './adminreported.html',
  styleUrl: './adminreported.css',
})
export class AdminReported {
  startDate = '';
  endDate = '';
  showSuccess = false;
  showError = false;
  errorMsg = '';
  reportedStatusId = 1;
  faPencil = faPencil;

  constructor(
    private router: Router,
    private apiServiceReported: ApiServiceReported,
    private apiGlobalService: GlobalService,

    private cdr: ChangeDetectorRef,
  ) {}

  reportedList: GetReportedAdmin = {
    getReportedStatuses: [],
    getReportedMember: [],
  };

  ngOnInit(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    this.startDate = this.formatDate(firstDay);

    this.loadreported();
  }

  loadreported(): void {
    this.apiServiceReported
      .getReported(this.reportedStatusId, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.reportedList = data;
          console.log(this.reportedList);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.cdr.detectChanges();
          console.error('One or more requests failed:', err);
        },
      });
  }

  selectReported(reported: GetReported): void {
    this.router.navigate(['/post'], {
      queryParams: {
        postguid: reported.postguid,
        postcommentid: reported.postcommentid,
      },
    });
  }

  // helpers
  updateReported(reportedid: number) {
    /*
    // get the record
    const announcement = this.announcementList.find((a) => a.announcementid === announcementid);
    if (!announcement) return;

    // fill in the fields
    this.announcementid = announcement.announcementid;
    this.title = announcement.title;
    this.announcement = announcement.announcement;
    this.dateexpire = new Date(announcement.dateexpire).toISOString().split('T')[0];
    */
  }

  formatDate(date: Date): string {
    return this.apiGlobalService.formatDate(date);
  }

  invalidDateRange(): boolean {
    this.errorMsg = 'Invalid date range';
    this.showError = this.apiGlobalService.invalidDateRange(this.startDate, this.endDate);
    return this.showError;
  }
}
