// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GetProfileMember } from '../models/member/getprofilemember';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceUserSettings {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/usersettings'; // Uses the API URL from environment

  // GET request to fetch data
  getUserSettings(userguid: string | undefined): Observable<any> {
    // NOTE - you dont need models for this architecture
    const getUserSettings$ = this.http.get(this.apiUrl + `/getUserSettings?userguid=${userguid}`);
    const getUserSettingsCatagories$ = this.http.get(
      this.apiUrl + `/getUserSettingsCatagories?userguid=${userguid}`,
    );
    const getUserSettingsUser$ = this.http.get(
      this.apiUrl + `/getUserSettingsUser?userguid=${userguid}`,
    );
    return forkJoin({
      getUserSettings: getUserSettings$,
      getUserSettingsCatagories: getUserSettingsCatagories$,
      getUserSettingsUser: getUserSettingsUser$,
    });
  }

  saveUserSettings(
    userguid: string,
    showUnrated: number,
    minPostRating: number,
    addNewUsers: number,
    addNewCatagories: number,
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/updateUserSettings?userguid=${encodeURIComponent(userguid)}&showUnrated=${showUnrated}&minPostRating=${minPostRating}&addNewUsers=${addNewUsers}&addNewCatagories=${addNewCatagories}`,
      {},
    );
  }

  saveUserMembers(response: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/UpdateUserSettingsMembers`, response);
  }

  saveUserCategories(response: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateUserSettingsCatagories`, response);
  }
}
