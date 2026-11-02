import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUserSettings } from '../../services/usersettingsservice';
import { AuthService } from '../../services/auth';
import { getusersettingscatagories } from '../../models/membersettings/getusersettingscatagories';
import { getusersettingsuser } from '../../models/membersettings/getusersettingsuser';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'membersettings',
  imports: [CommonModule, FormsModule],
  templateUrl: './membersettings.html',
  styleUrl: './membersettings.css',
})
export class MemberSettings implements OnInit {
  userguidloggedin: string = '';
  userSettingsCatagories: getusersettingscatagories[] = [];
  userSettingsUser: getusersettingsuser[] = [];
  getUserSettings: any[] = [];
  userSearch: string = '';
  showSuccess = false;
  showError = false;
  showSuccessCatagories = false;
  showErrorCatagories = false;
  showSuccessUser = false;
  showErrorUser = false;
  errorMsg = '';

  constructor(
    private apiServiceUserSettings: ApiServiceUserSettings,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userguidloggedin = this.authService.getUserGuid() ?? '';

    // Get the user settings from memory, if already loaded
    this.apiServiceUserSettings.getUserSettingsCached(this.userguidloggedin).subscribe({
      next: (data) => {
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

  selectAllUsers(): void {
    this.userSettingsUser.forEach((record) => {
      record.selected = 1;
    });
  }

  deselectAllUsers(): void {
    this.userSettingsUser.forEach((record) => {
      record.selected = 0;
    });
  }

  get filteredUsers() {
    return this.userSettingsUser.filter((user) =>
      user.name?.toLowerCase().includes(this.userSearch.toLowerCase()),
    );
  }

  toggleUser(user: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    user.selected = checked ? 1 : 0;
  }

  saveUsers(): void {
    // Turn off success and error messages
    this.showSuccessUser = false;
    this.showErrorUser = false;

    // Send in the user list
    const users = this.userSettingsUser.map((user) => ({
      userid: user.selecteduserid,
      selected: Number(user.selected),
    }));

    const request = {
      guid: this.userguidloggedin,
      users: users,
    };

    // Save the user list
    this.apiServiceUserSettings.saveUserMembers(request).subscribe({
      next: () => {
        // Refresh both user caches
        this.apiServiceUserSettings.refreshUserSettingsUsers(this.userguidloggedin).subscribe({
          next: () => {
            // Update component data from cache
            this.userSettingsUser = this.apiServiceUserSettings.userSettingsUsers();

            this.showSuccessUser = true;
            this.showErrorUser = false;

            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Unable to refresh user cache:', error);
            this.showErrorUser = true;
            this.cdr.detectChanges();
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.showErrorUser = true;

        if (error.status === 400) {
          this.errorMsg = error.error?.message || 'Invalid data submitted. Please check your form.';
        } else {
          this.errorMsg = error.error?.message || 'An unexpected error occurred. Please try again.';
        }

        this.cdr.detectChanges();
      },
    });
  }

  saveCategories(): void {
    // Turn off success and error messages
    this.showSuccessCatagories = false;
    this.showErrorCatagories = false;

    // Send in the category list
    const categories = this.userSettingsCatagories.map((category) => ({
      postcatagoryid: category.postcatagoryid,
      selected: Number(category.selected),
    }));

    const request = {
      guid: this.userguidloggedin,
      categories: categories,
    };

    // Save the category list
    this.apiServiceUserSettings.saveUserCategories(request).subscribe({
      next: () => {
        // Refresh both category caches
        this.apiServiceUserSettings.refreshUserSettingsCategories(this.userguidloggedin).subscribe({
          next: () => {
            // Update component data from cache
            this.userSettingsCatagories = this.apiServiceUserSettings.userSettingsCatagories();

            this.showSuccessCatagories = true;
            this.showErrorCatagories = false;

            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Unable to refresh category cache:', error);
            this.showErrorCatagories = true;
            this.cdr.detectChanges();
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.showErrorCatagories = true;

        if (error.status === 400) {
          this.errorMsg = error.error?.message || 'Invalid data submitted. Please check your form.';
        } else {
          this.errorMsg = error.error?.message || 'An unexpected error occurred. Please try again.';
        }

        this.cdr.detectChanges();
      },
    });
  }

  saveSettings(): void {
    this.showSuccess = false;
    this.showError = false;

    this.apiServiceUserSettings
      .saveUserSettings(
        this.userguidloggedin,
        this.getUserSettings[0].showunrated,
        this.getUserSettings[0].minpostrating,
        this.getUserSettings[0].addnewusers,
        this.getUserSettings[0].addnewcatagories,
      )
      .subscribe({
        next: () => {
          // Reload main settings cache
          this.apiServiceUserSettings.getUserSettingsMainCached(this.userguidloggedin).subscribe({
            next: (data) => {
              this.getUserSettings = data;
              this.showSuccess = true;
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Unable to refresh settings cache:', error);
              this.showError = true;
              this.cdr.detectChanges();
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.showError = true;

          if (error.status === 400) {
            this.errorMsg =
              error.error?.message || 'Invalid data submitted. Please check your form.';
          } else if (error.status === 409) {
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
