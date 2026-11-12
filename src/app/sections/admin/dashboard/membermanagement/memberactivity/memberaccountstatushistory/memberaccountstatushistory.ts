import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'memberaccountstatushistory',
  imports: [DatePipe],
  templateUrl: './memberaccountstatushistory.html',
  styleUrl: './memberaccountstatushistory.css',
})
export class MemberAccountStatusHistory {
  @Input({ required: true }) accountStatusHistory!: any[];
}
