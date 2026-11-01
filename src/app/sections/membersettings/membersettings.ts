import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiServiceUserSettings } from '../../services/usersettingsservice';
import { AuthService } from '../../services/auth';
import { getusersettingscatagories } from '../../models/membersettings/getusersettingscatagories';
import { getusersettingsuser } from '../../models/membersettings/getusersettingsuser';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'membersettings',
  imports: [CommonModule, JsonPipe, FormsModule],
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
    // turn off success and error messages
    this.showSuccessUser = false;
    this.showErrorUser = false;
  }

  saveCategories(): void {
    // turn off success and error messages
    this.showSuccessCatagories = false;
    this.showErrorCatagories = false;

    //send in the catagory list
    const categories = this.userSettingsCatagories.map((category) => ({
      postcatagoryid: category.postcatagoryid,
      selected: Number(category.selected),
    }));

    const request = {
      guid: this.userguidloggedin,
      categories: categories,
    };

    // all the save service all
    this.apiServiceUserSettings.saveUserCategories(request).subscribe({
      next: (response) => {
        this.showSuccessCatagories = true;
        this.showErrorCatagories = false;
        this.cdr.detectChanges();
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
