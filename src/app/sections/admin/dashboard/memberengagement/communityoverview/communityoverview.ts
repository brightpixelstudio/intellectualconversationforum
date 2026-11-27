import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { EngagementService } from '../../../../../services/engagementservice';
import { CommunityOverviewModel } from '../../../../../models/engagement/engagement';

@Component({
  selector: 'communityoverview',
  imports: [],
  templateUrl: './communityoverview.html',
  styleUrl: './communityoverview.css',
})
export class CommunityOverview implements OnChanges {
  @Input({ required: true }) startDate!: string;
  @Input({ required: true }) endDate!: string;

  communityOverview: CommunityOverviewModel | null = null;

  constructor(
    private apiEngagementService: EngagementService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getCommunityOverview();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate'] || changes['endDate']) {
      this.getCommunityOverview();
    }
  }

  getCommunityOverview(): void {
    const request = {
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.apiEngagementService.getCommunityOverview(request).subscribe({
      next: (response) => {
        this.communityOverview = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error retrieving Community Overview:', error);
      },
    });
  }
}
