import { Component } from '@angular/core';
import { MemberManagement } from './membermanagement/membermanagement';
import { SiteManagement } from './sitemanagement/sitemanagement';
import { MemberEngagement } from './memberengagement/memberengagement';

@Component({
  selector: 'dashboard',
  imports: [MemberManagement, SiteManagement, MemberEngagement],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
