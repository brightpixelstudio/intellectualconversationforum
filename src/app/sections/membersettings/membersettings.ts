import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUserSettings } from '../../services/usersettingsservice';
import { AuthService } from '../../services/auth';
import { getusersettingscatagories } from '../../models/membersettings/getusersettingscatagories';
import { getusersettingsuser } from '../../models/membersettings/getusersettingsuser';
import { HttpErrorResponse } from '@angular/common/http';
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
  showSuccess = false;
  showError = false;
  errorMsg = '';

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
    this.showSuccess = false;
    this.showError = false;

    this.apiServiceUserSettings
      .updateUserSettings(
        this.userguidloggedin,
        this.getUserSettings[0].showunrated,
        this.getUserSettings[0].minpostrating,
        this.getUserSettings[0].addnewusers,
        this.getUserSettings[0].addnewcatagories,
      )
      .subscribe({
        next: (response) => {
          this.showSuccess = true;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showError = true;

          if (error.status === 400) {
            this.errorMsg =
              error.error?.message || 'Invalid data submitted. Please check your form.';
          } else if (error.status === 409) {
            // Duplicate post
            this.errorMsg = error.error?.message || 'You have already posted this text.';
          } else {
            this.errorMsg =
              error.error?.message || 'An unexpected error occurred. Please try again.';
          }
          this.cdr.detectChanges();
        },
      });
  }
}
