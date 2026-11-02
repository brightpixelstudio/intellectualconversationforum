// src/app/services/api.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, tap } from 'rxjs';
import { GetProfileMember } from '../models/member/getprofilemember';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceUserSettings {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/usersettings'; // Uses the API URL from environment
  private cachedUserGuid: string | null = null;
  private myFeedSettingsLoaded = false;

  // Main settings
  private userSettingsState = signal<any>(null);

  // All users and categories, including selection status
  private userSettingsCatagoriesState = signal<any[]>([]);
  private userSettingsUsersState = signal<any[]>([]);

  // My Feed: selected categories and users only
  private userSettingsMyFeedCatagoriesState = signal<any[]>([]);
  private userSettingsMyFeedUsersState = signal<any[]>([]);

  // Read-only signals for components
  userSettings = this.userSettingsState.asReadonly();
  userSettingsCatagories = this.userSettingsCatagoriesState.asReadonly();
  userSettingsUsers = this.userSettingsUsersState.asReadonly();
  userSettingsMyFeedCatagories = this.userSettingsMyFeedCatagoriesState.asReadonly();
  userSettingsMyFeedUsers = this.userSettingsMyFeedUsersState.asReadonly();

  // GET request to fetch data
  getUserSettings(userguid: string | undefined): Observable<any> {
    return forkJoin({
      getUserSettings: this.http.get(this.apiUrl + `/getUserSettings?userguid=${userguid}`),
      getUserSettingsCatagories: this.http.get(
        this.apiUrl + `/getUserSettingsCatagories?userguid=${userguid}`,
      ),
      getUserSettingsUser: this.http.get(this.apiUrl + `/getUserSettingsUser?userguid=${userguid}`),
    }).pipe(
      tap((result) => {
        this.userSettingsState.set(result.getUserSettings);
        this.userSettingsCatagoriesState.set(result.getUserSettingsCatagories as any[]);
        this.userSettingsUsersState.set(result.getUserSettingsUser as any[]);

        // Remember which user owns this cache
        this.cachedUserGuid = userguid ?? null;
      }),
    );
  }
  getUserSettingsMyFeed(userguid: string | undefined): Observable<any> {
    return forkJoin({
      getUserSettingsCatagories: this.http.get(
        this.apiUrl + `/getUserSettingsCatagoriesMyFeed?userguid=${userguid}`,
      ),
      getUserSettingsUser: this.http.get(
        this.apiUrl + `/getUserSettingsUserMyFeed?userguid=${userguid}`,
      ),
    }).pipe(
      tap((result) => {
        this.userSettingsMyFeedCatagoriesState.set(result.getUserSettingsCatagories as any[]);
        this.userSettingsMyFeedUsersState.set(result.getUserSettingsUser as any[]);

        // Remember which user owns this cache
        this.cachedUserGuid = userguid ?? null;
        this.myFeedSettingsLoaded = true;
      }),
    );
  }

  // cached
  getUserSettingsCached(userguid: string): Observable<any> {
    if (this.cachedUserGuid === userguid && this.userSettingsState() !== null) {
      return of({
        getUserSettings: this.userSettingsState(),
        getUserSettingsCatagories: this.userSettingsCatagoriesState(),
        getUserSettingsUser: this.userSettingsUsersState(),
      });
    }

    // Cache is empty or belongs to another user
    return this.getUserSettings(userguid);
  }

  getUserSettingsMyFeedCached(userguid: string): Observable<any> {
    if (this.cachedUserGuid === userguid && this.myFeedSettingsLoaded) {
      return of({
        getUserSettingsCatagories: this.userSettingsMyFeedCatagoriesState(),
        getUserSettingsUser: this.userSettingsMyFeedUsersState(),
      });
    }

    return this.getUserSettingsMyFeed(userguid);
  }

  clearUserSettingsCache(): void {
    this.cachedUserGuid = null;

    this.myFeedSettingsLoaded = false;

    this.userSettingsState.set(null);
    this.userSettingsCatagoriesState.set([]);
    this.userSettingsUsersState.set([]);

    this.userSettingsMyFeedCatagoriesState.set([]);
    this.userSettingsMyFeedUsersState.set([]);
  }

  // saving
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
