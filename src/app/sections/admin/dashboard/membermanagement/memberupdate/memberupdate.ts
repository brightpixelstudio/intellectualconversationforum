import { Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUser } from '../../../../../services/userservice';
import { ApiServiceAdmin } from '../../../../../services/adminservice';
import { GetAccountStatuses } from '../../../../../models/member/getaccountstatuses';
import { GetProfileMember } from '../../../../../models/member/getprofilemember';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'memberupdate',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './memberupdate.html',
  styleUrl: './memberupdate.css',
})
export class MemberUpdate implements OnInit {
  @Input({ required: true }) member!: GetProfileMember;

  accountStatuses: GetAccountStatuses[] = [];
  accountStatusId = 1;
  reasonText = '';
  showSuccess = false;
  showError = false;
  errorMsg = '';

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServiceAdmin: ApiServiceAdmin,

    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.apiServiceUser.getAccountStatuses().subscribe({
      next: (data) => {
        this.accountStatuses = data;
        this.accountStatusId = this.member.accountstatusid;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Unable to load member profile:', err);
      },
    });
  }

  updateAccountStatus(): void {
    const reason = this.reasonText.trim();

    if (reason.length < 20) return;

    this.errorMsg = '';
    this.showSuccess = false;
    this.showError = false;

    this.apiServiceAdmin
      .submitAccountStatus(this.member.userid, this.accountStatusId, reason)
      .subscribe({
        next: (data) => {
          this.showSuccess = true;
          this.cdr.detectChanges();
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMsg =
              error.error?.message || 'Invalid data submitted. Please check your form.';
          } else {
            this.errorMsg =
              error.error?.message || 'An unexpected error occurred. Please try again.';
          }
        },
      });
  }
}
