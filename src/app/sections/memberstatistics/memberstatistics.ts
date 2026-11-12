import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { ApiServiceUser } from '../../services/userservice';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'memberstatistics',
  imports: [DatePipe, JsonPipe],
  templateUrl: './memberstatistics.html',
  styleUrl: './memberstatistics.css',
})
export class MemberStatistics implements OnInit {
  userguidloggedin: string = '';
  getUserStatisticsInformation: any = '';

  constructor(
    private apiService: ApiServiceUser,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userguidloggedin = this.authService.getUserGuid() ?? '';

    // forkjoin in the service will call all the procedures at once and return the data in one object.
    this.apiService.getUserProfileStatistics(this.userguidloggedin).subscribe({
      next: (data) => {
        // Data maps exactly to the keys defined in forkJoin
        this.getUserStatisticsInformation = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }
}
