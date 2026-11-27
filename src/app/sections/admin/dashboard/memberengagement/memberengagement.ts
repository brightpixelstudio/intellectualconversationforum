import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../../services/globalservice';
import { CommunityOverview } from './communityoverview/communityoverview';
import { MemberParticipation } from './memberparticipation/memberparticipation';

@Component({
  selector: 'memberengagement',
  imports: [FormsModule, CommunityOverview, MemberParticipation],
  templateUrl: './memberengagement.html',
  styleUrl: './memberengagement.css',
})
export class MemberEngagement {
  activeTab: string = 'overview';
  startDate = '';
  endDate = '';

  constructor(private apiGlobalService: GlobalService) {}

  ngOnInit(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    this.startDate = this.formatDate(firstDay);
  }

  formatDate(date: Date): string {
    return this.apiGlobalService.formatDate(date);
  }
}
