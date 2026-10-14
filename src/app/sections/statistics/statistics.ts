import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { ApiServiceStatistics } from '../../services/statisticservice';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'statistics',
  imports: [DatePipe],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements OnInit {
  getStatisticsInformation: any = '';

  constructor(
    @Inject(ApiServiceStatistics) private apiService: ApiServiceStatistics,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    // get ALL Blog information
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        // Data maps exactly to the keys defined in forkJoin
        this.getStatisticsInformation = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }
}
