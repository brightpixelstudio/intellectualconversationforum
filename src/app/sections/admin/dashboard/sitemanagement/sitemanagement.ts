import { Component } from '@angular/core';
import { Catagories } from './catagories/catagories';
import { Announcements } from './announcement/announcements';
import { NonActiveMembers } from './nonactivemembers/nonactivemembers';
import { AdminReported } from './adminreported/adminreported';
import { Ideas } from '../../../ideas/ideas';

@Component({
  selector: 'sitemanagement',
  imports: [Catagories, NonActiveMembers, Announcements, AdminReported, Ideas],
  templateUrl: './sitemanagement.html',
  styleUrl: './sitemanagement.css',
})
export class SiteManagement {}
