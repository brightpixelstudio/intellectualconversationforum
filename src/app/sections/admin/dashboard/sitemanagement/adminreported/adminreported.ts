import { Component, ChangeDetectorRef } from '@angular/core';
import { GetReported } from './../../../../../models/reported/getreported';
import { FormsModule } from '@angular/forms';
import { ApiServiceReported } from '../../../../../services/reportedservice';
import { GlobalService } from '../../../../../services/globalservice';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'adminreported',
  imports: [FormsModule, DatePipe],
  templateUrl: './adminreported.html',
  styleUrl: './adminreported.css',
})
export class AdminReported {
  startDate = '';
  endDate = '';
  showSuccess = false;
  showError = false;
  errorMsg = '';
  reportedStatusID = 1;

  constructor(
    private router: Router,
    private apiServiceReported: ApiServiceReported,
    private apiGlobalService: GlobalService,

    private cdr: ChangeDetectorRef,
  ) {}

  reportedList!: GetReported[];

  ngOnInit(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = this.formatDate(firstDay);
  }

  loadreported(): void {
    this.apiServiceReported
      .getReported(this.reportedStatusID, this.startDate, this.endDate)
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

  selectNotification(reported: GetReported): void {
    this.router.navigate(['/post'], {
      queryParams: {
        postguid: reported.postguid,
        postcommentid: reported.postcommentid,
      },
    });
  }

  // helpers
  formatDate(date: Date): string {
    return this.apiGlobalService.formatDate(date);
  }

  invalidDateRange(): boolean {
    this.errorMsg = 'Invalid date range';
    this.showError = this.apiGlobalService.invalidDateRange(this.startDate, this.endDate);
    return this.showError;
  }
}
