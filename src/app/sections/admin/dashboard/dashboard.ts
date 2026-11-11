import { Component } from '@angular/core';
import { MemberManagement } from './membermanagement/membermanagement';

@Component({
  selector: 'dashboard',
  imports: [MemberManagement],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
