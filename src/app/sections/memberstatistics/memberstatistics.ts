import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { JsonPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiServiceUser } from '../../services/userservice';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'memberstatistics',
  imports: [DatePipe, JsonPipe],
  templateUrl: './memberstatistics.html',
  styleUrl: './memberstatistics.css',
})
export class MemberStatistics implements OnInit {
  userId: number = 0;
  getUserStatisticsInformation: any = '';

  constructor(
    private apiService: ApiServiceUser,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // get the query string value
    const userId = this.route.snapshot.queryParamMap.get('userid');
    if (!userId) return;
    this.userId = +userId;

    // this.userId = 5; // testing

    // look at Sunray to call all procedures at once.
    this.apiService.getUserStatistics(this.userId).subscribe({
      next: (data) => {
        // Data maps exactly to the keys defined in forkJoin
        this.getUserStatisticsInformation = data;

        // load a blog post
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }
}
