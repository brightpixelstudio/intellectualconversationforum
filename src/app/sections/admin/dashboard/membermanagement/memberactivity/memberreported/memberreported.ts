import { Component, Input } from '@angular/core';

@Component({
  selector: 'memberreported',
  imports: [],
  templateUrl: './memberreported.html',
  styleUrl: './memberreported.css',
})
export class MemberReported {
  @Input({ required: true }) reported!: any[];
}
