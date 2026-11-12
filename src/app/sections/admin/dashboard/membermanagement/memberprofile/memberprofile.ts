import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { ApiServiceUser } from './../../../../../services/userservice';
import { GetProfileMember } from '../../../../../models/member/getprofilemember';

@Component({
  selector: 'memberprofile',
  imports: [DatePipe, JsonPipe],
  templateUrl: './memberprofile.html',
  styleUrl: './memberprofile.css',
})
export class MemberProfile implements OnChanges {
  @Input({ required: true }) getUserProfile: any = null;
  loading = false;
  errorMessage = '';

  constructor(
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['getUserProfile'] && this.getUserProfile) {
      // Update any local properties needed for displaying the profile.
    }
  }
}
