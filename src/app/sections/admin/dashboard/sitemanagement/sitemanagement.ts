import { Component } from '@angular/core';
import { Catagories } from './catagories/catagories';
import { Announcements } from './announcement/announcements';
import { NonActiveMembers } from './nonactivemembers/nonactivemembers';

@Component({
  selector: 'sitemanagement',
  imports: [Catagories, NonActiveMembers, Announcements],
  templateUrl: './sitemanagement.html',
  styleUrl: './sitemanagement.css',
})
export class SiteManagement {}
