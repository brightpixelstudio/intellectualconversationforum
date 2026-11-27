import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'memberparticipation',
  imports: [],
  templateUrl: './memberparticipation.html',
  styleUrl: './memberparticipation.css',
})
export class MemberParticipation implements OnChanges {
  @Input({ required: true }) startDate!: string;
  @Input({ required: true }) endDate!: string;

  ngOnChanges(changes: SimpleChanges): void {}
}
