import { Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUser } from '../../../../../services/userservice';
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.apiServiceUser.getAccountStatuses().subscribe({
      next: (data) => {
        this.accountStatuses = data;
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

    this.apiServiceUser
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
          } else if (error.status === 404) {
            this.errorMsg = error.error?.message || 'The post or image could not be found.';
          } else if (error.status === 409) {
            this.errorMsg = error.error?.message || 'You have already posted this text.';
          } else {
            this.errorMsg =
              error.error?.message || 'An unexpected error occurred. Please try again.';
          }
        },
      });
  }
}
