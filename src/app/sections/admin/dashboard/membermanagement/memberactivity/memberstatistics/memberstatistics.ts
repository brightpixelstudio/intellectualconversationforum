import { Component, Input } from '@angular/core';
import { GetUserStatistics } from '../../../../../../models/statistics/getuserstatistics';

@Component({
  selector: 'memberstatistics',
  imports: [],
  templateUrl: './memberstatistics.html',
  styleUrl: './memberstatistics.css',
})
export class MemberStatistics {
  @Input({ required: true }) statistics?: GetUserStatistics;
}
