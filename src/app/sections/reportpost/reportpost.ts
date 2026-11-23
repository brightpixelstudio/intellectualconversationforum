import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
import { GetReported } from '../../models/reported/getreported';
import { GetPost } from '../../models/posts/getpost';
import { ApiServiceReported } from './../../services/reportedservice';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { GetPostComments } from '../../models/posts/getpostcomments';

@Component({
  selector: 'reportpost',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './reportpost.html',
  styleUrl: './reportpost.css',
})
export class ReportPost implements OnInit {
  @Input({ required: true }) post!: GetPost;
  @Input() comment!: GetPostComments;

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
    this.reportPostId = this.post.postid;
    if (this.comment) {
      this.reportCommentId = this.comment.postcommentid;
    }
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

    console.log(report);
    return;

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

  openReport() {
    this.showReportedSuccess = false;
    this.showReportedError = false;
    this.showReport = true;
    this.reportTitle = this.reportCommentId == 0 ? 'Report a Post ' : 'Report a Comment';
  }
}
