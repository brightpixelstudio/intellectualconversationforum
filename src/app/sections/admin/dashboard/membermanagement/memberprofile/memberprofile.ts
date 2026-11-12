import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiServiceUser } from './../../../../../services/userservice';

@Component({
  selector: 'memberprofile',
  imports: [DatePipe],
  templateUrl: './memberprofile.html',
  styleUrl: './memberprofile.css',
})
export class MemberProfile implements OnInit {
  @Input({ required: true }) userguid!: string;

  getUserProfile: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMemberProfile();
  }

  loadMemberProfile(): void {
    this.loading = true;

    this.apiServiceUser.getUserProfileStatistics(this.userguid).subscribe({
      next: (data) => {
        this.getUserProfile = data;
        this.loading = false;
        this.cdr.detectChanges();

        console.log(this.getUserProfile);
      },
      error: (err) => {
        console.error('Unable to load member profile:', err);
        this.errorMessage = 'Unable to load member profile.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
