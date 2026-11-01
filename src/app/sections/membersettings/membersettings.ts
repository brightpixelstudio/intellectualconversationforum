import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUserSettings } from '../../services/usersettingsservice';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'membersettings',
  imports: [],
  templateUrl: './membersettings.html',
  styleUrl: './membersettings.css',
})
export class MemberSettings implements OnInit {
  userguidloggedin: string = '';
  getUserSettings: any = '';
  //  userguidloggedin: string | null = null;
  //  rating: number = 0;

  constructor(
    private apiServiceUserSettings: ApiServiceUserSettings,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userguidloggedin = this.authService.getUserGuid() ?? '';

    // get the user settings
    this.apiServiceUserSettings.getUserSettings(this.userguidloggedin).subscribe({
      next: (data) => {
        // Data maps exactly to the keys defined in forkJoin
        this.getUserSettings = data;
        console.log(this.getUserSettings);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }

  // Events
  // **************************
  // Main Filters
  onPostRatingChange(ratingIn: string) {
    // ensure there is some value and it is between 1 and 10
    const rating = ratingIn === '' ? 0 : Number(ratingIn);
    if (rating !== 0 && (rating < 1 || rating > 10)) {
      return;
    }
    //this.rating = +ratingIn;
  }
}
