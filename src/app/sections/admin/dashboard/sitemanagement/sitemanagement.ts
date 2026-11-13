import { Component } from '@angular/core';
import { Catagories } from './catagories/catagories';
import { NonActiveMembers } from './nonactivemembers/nonactivemembers';

@Component({
  selector: 'sitemanagement',
  imports: [Catagories, NonActiveMembers],
  templateUrl: './sitemanagement.html',
  styleUrl: './sitemanagement.css',
})
export class SiteManagement {}
