import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUserSettings } from '../../services/usersettingsservice';
import { AuthService } from '../../services/auth';
import { getusersettingscatagories } from '../../models/membersettings/getusersettingscatagories';
import { getusersettingsuser } from '../../models/membersettings/getusersettingsuser';
import { getusersettings } from '../../models/membersettings/getusersettings';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'membersettings',
  imports: [JsonPipe],
  templateUrl: './membersettings.html',
  styleUrl: './membersettings.css',
})
export class MemberSettings implements OnInit {
  userguidloggedin: string = '';
  userSettingsCatagories: getusersettingscatagories[] = [];
  userSettingsUser: getusersettingsuser[] = [];
  getUserSettings: any[] = [];
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
        this.getUserSettings = data.getUserSettings;
        this.userSettingsCatagories = data.getUserSettingsCatagories;
        this.userSettingsUser = data.getUserSettingsUser;
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
  onPostRatingChange(input: HTMLInputElement) {
    const rating = input.value === '' ? 0 : Number(input.value);

    if (rating !== 0 && (rating < 1 || rating > 10)) {
      input.value = '';
      return;
    }

    this.getUserSettings[0].minpostrating = rating;
  }
  selectAllCategories(): void {
    this.userSettingsCatagories.forEach((record) => {
      record.selected = 1;
    });
  }

  deselectAllCategories(): void {
    this.userSettingsCatagories.forEach((record) => {
      record.selected = 0;
    });
  }

  updateSettings(): void {
    console.log('Updated Settings:', this.getUserSettings);
  }
}
