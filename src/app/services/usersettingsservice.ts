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
  getUserProfile(userguid: string): Observable<GetProfileMember> {
    return this.http.get<GetProfileMember>(this.apiUrl + `/getProfileMember?userguid=${userguid}`);
  }

  getUserSettings(userguid: string | undefined): Observable<any> {
    // NOTE - you dont need models for this architecture
    const getUserSettings$ = this.http.get(this.apiUrl + `/getUserSettings?userguid=${userguid}`);
    const getusersettingscatagories$ = this.http.get(
      this.apiUrl + `/getUserSettingsCategories?userguid=${userguid}`,
    );
    return forkJoin({
      getUserSettings: getUserSettings$,
      getUserSettingsCategories: getusersettingscatagories$,
    });
  }

  /* 
  submitUpdateProfileForm(userguid: string, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updateMemberProfile?userguid=${userguid}`, formData);
  }
*/
}
