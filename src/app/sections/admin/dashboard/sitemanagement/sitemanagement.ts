import { Component } from '@angular/core';
import { Catagories } from './catagories/catagories';

@Component({
  selector: 'sitemanagement',
  imports: [Catagories],
  templateUrl: './sitemanagement.html',
  styleUrl: './sitemanagement.css',
})
export class SiteManagement {}
