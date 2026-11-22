import { Component, ChangeDetectorRef } from '@angular/core';
import { GetReported } from './../../../../../models/reported/getreported';
import { FormsModule } from '@angular/forms';
import { ApiServiceReported } from '../../../../../services/reportedservice';
import { AuthService } from '../../../../../services/auth';
import { GlobalService } from '../../../../../services/globalservice';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GetReportedAdmin } from '../../../../../models/reported/getreportedadmin';
import { ReportedStatus } from '../../../../../enums/reportedstatus';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'adminreported',
  imports: [FormsModule, DatePipe, FontAwesomeModule, JsonPipe],
  templateUrl: './adminreported.html',
  styleUrl: './adminreported.css',
})
export class AdminReported {
  startDate = '';
  endDate = '';
  showSuccess = false;
  showError = false;
  errorMsg = '';
  reportedStatusId = ReportedStatus.Pending;
  response = '';
  reportedStatusIdUpdate = ReportedStatus.NoActionNecessary;
  reportedId = 0;
  faPencil = faPencil;
  showUpdate = false;
  protected ReportedStatus = ReportedStatus;

  constructor(
    private router: Router,
    private apiServiceReported: ApiServiceReported,
    private apiAuthService: AuthService,
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
  updateReportedShow(reportedId: number) {
    this.showSuccess = false;
    this.showError = false;
    this.showUpdate = true;
    this.reportedId = reportedId;
  }

  updateReported() {
    this.showSuccess = false;
    this.showError = false;

    if (!this.response.trim() || this.response.trim().length < 10) {
      return;
    }

    // create the call
    const apiCall = this.apiServiceReported.submitReportedUpdate(
      this.reportedId,
      this.response,
      this.reportedStatusIdUpdate,
      this.apiAuthService.getUserGuid() ?? undefined,
    );

    // make the call
    apiCall.subscribe({
      next: (data) => {
        this.showUpdate = false;
        this.showSuccess = true;
        this.showError = false;
        this.response = '';
        this.loadreported();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'There was an error updating the reported post';
        this.showSuccess = false;
        this.showError = true;
        this.cdr.detectChanges();
      },
    });
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
