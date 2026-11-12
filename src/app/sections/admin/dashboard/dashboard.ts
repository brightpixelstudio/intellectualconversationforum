import { Component } from '@angular/core';
import { MemberManagement } from './membermanagement/membermanagement';
import { SiteManagement } from './sitemanagement/sitemanagement';

@Component({
  selector: 'dashboard',
  imports: [MemberManagement, SiteManagement],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
