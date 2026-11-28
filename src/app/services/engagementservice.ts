import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  CommunityOverviewRequest,
  CommunityOverviewModel,
} from '../models/engagement/communityoverviewmodel';
import { EngagementMemberParticipationResponse } from '../models/engagement/engagementmemberparticipationmodel';

@Injectable({
  providedIn: 'root',
})
export class EngagementService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/engagement'; // Uses the API URL from environment

  // Get Community Overview Statistics
  getCommunityOverview(request: CommunityOverviewRequest): Observable<CommunityOverviewModel> {
    return this.http.post<CommunityOverviewModel>(
      `${this.apiUrl}/GetEngagementCommunityOverview`,
      request,
    );
  }

  getEngagementMemberParticipation(request: {
    startDate: string;
    endDate: string;
  }): Observable<EngagementMemberParticipationResponse> {
    return this.http.post<EngagementMemberParticipationResponse>(
      `${this.apiUrl}/Engagement/GetEngagementMemberParticipation`,
      request,
    );
  }
}
