import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { EngagementService } from '../../../../../services/engagementservice';
import {
  EngagementMemberParticipationResponse,
  MemberParticipationSummary,
  MemberParticipationActivity,
  MemberParticipationPattern,
  MemberParticipationRetention,
} from '../../../../../models/engagement/engagementmemberparticipationmodel';

@Component({
  selector: 'memberparticipation',
  imports: [],
  templateUrl: './memberparticipation.html',
  styleUrl: './memberparticipation.css',
})
export class MemberParticipation implements OnChanges {
  @Input({ required: true }) startDate!: string;
  @Input({ required: true }) endDate!: string;

  engagementMemberParticipation: EngagementMemberParticipationResponse | null = null;

  constructor(
    private apiEngagementService: EngagementService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getEngagementMemberParticipation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate'] || changes['endDate']) {
      this.getEngagementMemberParticipation();
    }
  }

  getEngagementMemberParticipation(): void {
    const request = {
      startDate: this.startDate,
      endDate: this.endDate,
    };

    this.apiEngagementService.getEngagementMemberParticipation(request).subscribe({
      next: (response) => {
        this.engagementMemberParticipation = response;
        console.log(this.engagementMemberParticipation);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error retrieving Community Overview:', error);
      },
    });
  }
}
