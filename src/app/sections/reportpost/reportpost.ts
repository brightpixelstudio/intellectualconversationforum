import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { GetReported } from '../../models/reported/getreported';
import { ApiServiceReported } from './../../services/reportedservice';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'reportpost',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './reportpost.html',
  styleUrl: './reportpost.css',
})
export class ReportPost implements OnInit {
  userguidloggedin: string = '';
  showReportedSuccess = false;
  showReportedError = false;
  reportReason: string = '';
  reportPostId = 0;
  reportCommentId = 0;
  reportTitle = '';
  errorMsg = '';

  showReport = false;
  faFlag = faFlag;

  constructor(
    public apiServiceReported: ApiServiceReported,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userguidloggedin = this.authService.getUserGuid() ?? '';
  }

  submitReport(): void {
    // create a form reported object with values
    const report: GetReported = {
      reportedid: 0,
      reportedstatusid: 1,
      reportedusername: '',
      reporteduserguid: this.userguidloggedin,
      statusname: '',
      postid: this.reportPostId,
      postguid: '',
      postcommentid: this.reportCommentId,
      reportedcontent: '',
      reason: this.reportReason,
      response: null,
      dateadded: null,
      dateresponded: null,
      respondeduserid: null,
      respondedusername: '',
      respondeduserguid: '',
    };

    this.apiServiceReported.submitReported(report).subscribe({
      next: () => {
        this.reportReason = '';
        this.showReportedSuccess = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMsg = 'Failed to submit reported post';
      },
    });
  }

  openReport(postid: number, commentid: number) {
    this.showReportedSuccess = false;
    this.showReportedError = false;
    this.showReport = true;
    this.reportPostId = postid;
    this.reportCommentId = commentid;
    this.reportTitle = postid == 0 ? 'Report a Comment ' : 'Report a Post';
  }
}
